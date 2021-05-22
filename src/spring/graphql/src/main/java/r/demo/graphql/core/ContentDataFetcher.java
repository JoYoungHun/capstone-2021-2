package r.demo.graphql.core;

import edu.stanford.nlp.ling.CoreLabel;
import graphql.schema.DataFetcher;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.interceptor.TransactionAspectSupport;
import r.demo.graphql.annotation.Gql;
import r.demo.graphql.annotation.GqlDataFetcher;
import r.demo.graphql.annotation.GqlType;
import r.demo.graphql.domain.category.Category;
import r.demo.graphql.domain.category.CategoryRepo;
import r.demo.graphql.domain.content.Content;
import r.demo.graphql.domain.content.ContentRepo;
import r.demo.graphql.domain.report.ReportRepo;
import r.demo.graphql.domain.sentence.Sentence;
import r.demo.graphql.domain.sentence.SentenceRepo;
import r.demo.graphql.domain.user.UserInfo;
import r.demo.graphql.domain.user.UserInfoRepo;
import r.demo.graphql.domain.word.Word;
import r.demo.graphql.domain.word.WordRepo;
import r.demo.graphql.response.DefaultResponse;
import r.demo.graphql.response.ProblemResponse;
import r.demo.graphql.response.SummaryResponse;
import r.demo.graphql.types.Paragraph;
import r.demo.graphql.types.Problem;
import r.demo.graphql.types.SummaryShell;
import r.demo.graphql.types.SummaryToken;
import r.demo.graphql.utils.InternalFilterChains;
import r.demo.graphql.utils.StanfordLemmatizer;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Gql
@Service
public class ContentDataFetcher {
    private final StanfordLemmatizer lemmatizer;
    private final InternalFilterChains chains;
    private final UserInfoRepo userRepo;
    private final ContentRepo contentRepo;
    private final WordRepo wordRepo;
    private final SentenceRepo sentenceRepo;
    private final CategoryRepo categoryRepo;
    private final ReportRepo reportRepo;
    private final List<String> validPos;

    public ContentDataFetcher(@Lazy StanfordLemmatizer lemmatizer,
                              InternalFilterChains chains,
                              UserInfoRepo userRepo, ContentRepo contentRepo,
                              WordRepo wordRepo, SentenceRepo sentenceRepo,
                              CategoryRepo categoryRepo, ReportRepo reportRepo) {
        this.lemmatizer = lemmatizer;
        this.chains = chains;
        this.userRepo = userRepo;
        this.contentRepo = contentRepo;
        this.wordRepo = wordRepo;
        this.sentenceRepo = sentenceRepo;
        this.categoryRepo = categoryRepo;
        this.reportRepo = reportRepo;
        this.validPos = Arrays.asList("v.", "conj.", "ad.", "n.");
    }

    @GqlDataFetcher(type = GqlType.MUTATION)
    @SuppressWarnings("unchecked")
    public DataFetcher<?> createContent() {
        return environment -> {
            try {
                LinkedHashMap<String, Object> inputObj = environment.getArgument("input");
                List<LinkedHashMap<String, String>> words = (List<LinkedHashMap<String, String>>) inputObj.get("words"),
                        sentences = (List<LinkedHashMap<String, String>>) inputObj.get("sentences");
                List<Integer> categoryKeys = (List<Integer>) inputObj.get("categories");
                String title = inputObj.get("title").toString(),
                        ref = inputObj.get("ref").toString(),
                        captions = inputObj.get("captions").toString();

                HttpStatus isAuthenticated = chains.doFilter(Arrays.asList("ROLE_ADMIN", "ROLE_USER"));
                if (isAuthenticated.equals(HttpStatus.OK)) {
                    UserInfo registerer = userRepo.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName())
                            .orElseThrow(() -> new IndexOutOfBoundsException("Invalid user"));
                    Set<Category> categories = new HashSet<>();
                    for (int categoryKey : categoryKeys) {
                        try {
                            categories.add(categoryRepo.findById((long) categoryKey).orElseThrow(IndexOutOfBoundsException::new));
                        } catch (IndexOutOfBoundsException ignored) { }
                    }
                    Content content = contentRepo.save(Content.builder().title(title).ref(ref).captions(captions).categories(categories).user(registerer).build());
                    for (int i = 0; i < words.size(); i++) {
                        Paragraph word = new Paragraph(words.get(i));
                        CoreLabel label = lemmatizer.getCoreLabel(word.getEng());
                        // save if pos valid.
                        if (validPos.contains(lemmatizer.partOfSpeech(label.tag())))
                            wordRepo.save(Word.builder().content(content).eng(word.getEng()).kor(word.getKor())
                                    .pos(label.tag()).lemma(label.lemma()).sequence(i).build());

                    }
                    for (int i = 0; i < sentences.size(); i++) {
                        Paragraph sentence = new Paragraph(sentences.get(i));
                        sentenceRepo.save(Sentence.builder().content(content).eng(sentence.getEng()).kor(sentence.getKor()).sequence(i).build());
                    }
                }
                return new DefaultResponse(isAuthenticated);
            } catch (RuntimeException e) {
                return new DefaultResponse(HttpStatus.NOT_FOUND.value(), e.getMessage());
            } catch (Exception e) {
                e.printStackTrace();
                TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
                return new DefaultResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage());
            }
        };
    }

    @GqlDataFetcher(type = GqlType.QUERY)
    public DataFetcher<?> allContents() {
        return environment -> {
            LinkedHashMap<String, Object> lhm = new LinkedHashMap<>();
            try {
                long categoryKey = Long.parseLong(environment.getArgument("category").toString());
                Integer option = environment.getArgument("option");
                final LinkedHashMap<String, Object> req = environment.getArgument("pr");
                int page = Integer.parseInt(req.get("page").toString()),
                        renderItem = Integer.parseInt(req.get("renderItem").toString());
                Category category;
                Page<Content> contents;
                if (categoryKey != -1) {
                    category = categoryRepo.findById(categoryKey).orElseThrow(IllegalArgumentException::new);
                    if (option != null && option == 1) {
                        Set<Long> filters = contentRepo.findAllByCategory(category).stream().map(Content::getId).collect(Collectors.toSet());
                        if (filters.size() == 0) filters.add(-1L);
                        contents = contentRepo.findAllByIdIsNotIn(filters, PageRequest.of(page - 1, renderItem));
                    } else { contents = contentRepo.findAllByCategory(category, PageRequest.of(page - 1, renderItem)); }
                } else {
                    contents = contentRepo.findAll(PageRequest.of(page - 1, renderItem));
                }
                lhm.put("contents", contents);
                lhm.put("totalElements", contents.getTotalElements());
            } catch (RuntimeException e) {
                lhm.put("contents", Collections.emptyList());
                lhm.put("totalElements", 0);
            } catch (Exception e) {
                e.printStackTrace();
                lhm.put("contents", Collections.emptyList());
                lhm.put("totalElements", 0);
            }
            return lhm;
        };
    }

    @GqlDataFetcher(type = GqlType.QUERY)
    public DataFetcher<?> content() {
        return environment -> {
            try {
                long contentKey = environment.getArgument("id");
                return contentRepo.findById(contentKey).orElseThrow(IllegalArgumentException::new);
            } catch (IllegalArgumentException e) {
                return null;
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        };
    }

    @GqlDataFetcher(type = GqlType.MUTATION)
    public DataFetcher<?> deleteContent() {
        return environment -> {
            try {
                long contentKey = Long.parseLong(environment.getArgument("id").toString());
                HttpStatus isAuthenticated = chains.doFilter(Collections.singletonList("ROLE_ADMIN"));
                if (isAuthenticated.equals(HttpStatus.OK)) {
                    if (this.deleteContentDetails(contentKey))
                        throw new RuntimeException();
                }
                return new DefaultResponse(isAuthenticated);
            } catch (RuntimeException e) {
                return new DefaultResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage());
            }
        };
    }

    @GqlDataFetcher(type = GqlType.MUTATION)
    public DataFetcher<?> saveContentsToCategory() {
        return environment -> {
            try {
                long categoryKey = Long.parseLong(environment.getArgument("category").toString());
                List<Integer> keys = environment.getArgument("id");

                HttpStatus isAuthenticated = chains.doFilter(Collections.singletonList("ROLE_ADMIN"));
                if (isAuthenticated.equals(HttpStatus.OK)) {
                    Category category = categoryRepo.findById(categoryKey).orElseThrow(IllegalArgumentException::new);
                    List<Long> ctgContents = contentRepo.findAllByCategory(category).stream().map(Content::getId).collect(Collectors.toList()),
                            reqContents = contentRepo.findAllByIdIsIn(keys.stream().mapToLong(i -> (long) i).boxed().collect(Collectors.toSet()))
                                    .stream().map(Content::getId).collect(Collectors.toList());

                    Set<Long> nonDuplicatedIds = new HashSet<>(ctgContents);
                    nonDuplicatedIds.addAll(reqContents);

                    List<Content> contents = contentRepo.findAllByIdIsIn(nonDuplicatedIds);
                    for (Content content : contents)
                        content.addCategory(category);

                    contentRepo.saveAll(contents);
                }
                return new DefaultResponse(isAuthenticated);
            } catch (IllegalArgumentException e) {
                return new DefaultResponse(HttpStatus.NOT_FOUND.value(), e.getMessage());
            } catch (RuntimeException e) {
                return new DefaultResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage());
            }
        };
    }

    @GqlDataFetcher(type = GqlType.MUTATION)
    public DataFetcher<?> deleteContentsInCategory() {
        return environment -> {
            try {
                long categoryKey = Long.parseLong(environment.getArgument("category").toString()),
                        contentKey = Long.parseLong(environment.getArgument("id").toString());

                HttpStatus isAuthenticated = chains.doFilter(Collections.singletonList("ROLE_ADMIN"));
                if (isAuthenticated.equals(HttpStatus.OK)) {
                    Category category = categoryRepo.findById(categoryKey).orElseThrow(IllegalArgumentException::new);
                    Content content = contentRepo.findById(contentKey).orElseThrow(IllegalArgumentException::new);

                    content.filterCategory(category);
                    contentRepo.save(content);
                }
                return new DefaultResponse(isAuthenticated);
            } catch (IllegalArgumentException e) {
                return new DefaultResponse(HttpStatus.NOT_FOUND.value(), e.getMessage());
            } catch (RuntimeException e) {
                return new DefaultResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage());
            }
        };
    }

    @GqlDataFetcher(type = GqlType.QUERY)
    public DataFetcher<?> summary() {
        return environment -> {
            try {
                long contentKey = environment.getArgument("content");
                int level = environment.getArgument("level"),
                        page = environment.getArgument("page");
                Content content = contentRepo.findById(contentKey).orElseThrow(IllegalArgumentException::new);
                // persist
                Page<Sentence> sentences = sentenceRepo.findAllByContent(content, PageRequest.of(page - 1, 8, Sort.Direction.ASC, "sequence"));
                List<SummaryShell> shells = new ArrayList<>();
                for (Sentence sentence : sentences) {
                    StringBuilder sb = new StringBuilder();
                    int hidden = 0, len = sentence.getEng().split(" ").length;
                    final int needToHideElements = (int) Math.floor(len * (level == 0 ? 0 : level == 1 ? 0.3 : 0.7));
                    List<SummaryToken> tokens = new ArrayList<>();
                    List<CoreLabel> labels = lemmatizer.getPartOfSpeechAboutSentence(sentence.getEng());
                    for (CoreLabel label : labels) {
                        int labelLen = label.originalText().length();
                        Optional<Word> word = wordRepo.getMatchedLatestWord(content, label.lemma(), label.word());
                        String translatedKorean = "";
                        boolean highlight = false;
                        if (word.isPresent()) {
                            translatedKorean = word.get().getKor();
                            highlight = true;
                        }
                        SummaryToken token = SummaryToken.builder().eng(label.originalText()).kor(translatedKorean).highlight(highlight)
                                .pos(lemmatizer.partOfSpeech(word.map(Word::getPos).orElse(label.tag()))).build();

                        // hide algorithm
                        int rand = (int) (Math.random() * 10);
                        if (rand > 0.7 && hidden < needToHideElements && validPos.contains(token.getPos())) {
                            sb.append(Stream.generate(() -> "_").limit(Math.min(3, labelLen)).collect(Collectors.joining()));
                            hidden++;
                        } else sb.append(label.originalText());
                        sb.append(" ");
                        tokens.add(token);
                    }
                    shells.add(SummaryShell.builder().originalText(sb.toString()).translatedKor(sentence.getKor()).tokens(tokens).build());
                }

                return new SummaryResponse(shells, sentences.getTotalPages());
            } catch (IllegalArgumentException e) {
                return new SummaryResponse(Collections.emptyList(), 0);
            } catch (Exception e) {
                e.printStackTrace();
                return new SummaryResponse(Collections.emptyList(), 0);
            }
        };
    }

    @GqlDataFetcher(type = GqlType.QUERY)
    public DataFetcher<?> choices() {
        return environment -> {
            try {
                long except = environment.getArgument("except");
                int option = environment.getArgument("option");
                HttpStatus isAuthenticated = chains.doFilter(Arrays.asList("ROLE_ADMIN", "ROLE_USER", "ROLE_READONLY"));
                if (isAuthenticated.equals(HttpStatus.OK)) {
                    List<Problem> problems;
                    switch (option) {
                        case 0:
                            Word word = wordRepo.findById(except).orElseThrow(IllegalArgumentException::new);
                            List<Word> words = wordRepo.getRandWords(except, word.getEng());
                            words.add(word);
                            Collections.shuffle(words);
                            problems = words.stream().map(Problem::new).collect(Collectors.toList());
                            break;
                        case 1:
                            Sentence sentence = sentenceRepo.findById(except).orElseThrow(IllegalArgumentException::new);
                            List<Sentence> sentences = sentenceRepo.getRandSentences(except, sentence.getEng());
                            sentences.add(sentence);
                            Collections.shuffle(sentences);
                            problems = sentences.stream().map(Problem::new).collect(Collectors.toList());
                            break;
                        default:
                            throw new IllegalArgumentException();
                    }
                    return new ProblemResponse(HttpStatus.OK.value(), problems);
                } else return new ProblemResponse(isAuthenticated.value(), Collections.emptyList());
            } catch (IllegalArgumentException e) {
                e.printStackTrace();
                return new ProblemResponse(HttpStatus.NOT_FOUND.value(), Collections.emptyList());
            } catch (Exception e) {
                e.printStackTrace();
                return new ProblemResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), Collections.emptyList());
            }
        };
    }

    @GqlDataFetcher(type = GqlType.QUERY)
    public DataFetcher<?> allWords() {
        return environment -> {
            try {
                long contentKey = environment.getArgument("id");
                HttpStatus isAuthenticated = chains.doFilter(Arrays.asList("ROLE_ADMIN", "ROLE_USER", "ROLE_READONLY"));
                if (isAuthenticated.equals(HttpStatus.OK)) {
                    Content content = contentRepo.findById(contentKey).orElseThrow(IllegalArgumentException::new);
                    return new ProblemResponse(HttpStatus.OK.value(), wordRepo.getAllWordsByRandOrdered(content).stream().map(Problem::new).collect(Collectors.toList()));
                } else return new ProblemResponse(isAuthenticated.value());
            } catch (IllegalArgumentException e) {
                return new ProblemResponse(HttpStatus.NOT_FOUND.value());
            } catch (Exception e) {
                e.printStackTrace();
                return new ProblemResponse(HttpStatus.INTERNAL_SERVER_ERROR.value());
            }
        };
    }

    @GqlDataFetcher(type = GqlType.QUERY)
    public DataFetcher<?> allSentences() {
        return environment -> {
            try {
                long contentKey = environment.getArgument("id");
                HttpStatus isAuthenticated = chains.doFilter(Arrays.asList("ROLE_ADMIN", "ROLE_USER", "ROLE_READONLY"));
                if (isAuthenticated.equals(HttpStatus.OK)) {
                    Content content = contentRepo.findById(contentKey).orElseThrow(IllegalArgumentException::new);
                    return new ProblemResponse(HttpStatus.OK.value(), sentenceRepo.getAllSentencesByRandOrdered(content).stream().map(Problem::new).collect(Collectors.toList()));
                } else return new ProblemResponse(isAuthenticated.value());
            } catch (IllegalArgumentException e) {
                return new ProblemResponse(HttpStatus.NOT_FOUND.value());
            } catch (Exception e) {
                e.printStackTrace();
                return new ProblemResponse(HttpStatus.INTERNAL_SERVER_ERROR.value());
            }
        };
    }

    public boolean deleteContentDetails(long contentKey) {
        try {
            Content content = contentRepo.findById(contentKey).orElseThrow(IndexOutOfBoundsException::new);
            contentRepo.updateSQLMode(0);

            wordRepo.disconnectWithParent(content);
            sentenceRepo.disconnectWithParent(content);
            reportRepo.disconnectWithParent(content);
            // after delete child rows
            contentRepo.delete(content);
            contentRepo.updateSQLMode(1);
            return false;
        } catch (RuntimeException e) {
            e.printStackTrace();
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return true;
        }
    }
}
