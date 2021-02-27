package r.demo.graphql.core;

import graphql.schema.DataFetcher;
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
import r.demo.graphql.domain.sentence.Sentence;
import r.demo.graphql.domain.sentence.SentenceRepo;
import r.demo.graphql.domain.user.UserInfo;
import r.demo.graphql.domain.user.UserInfoRepo;
import r.demo.graphql.domain.word.Word;
import r.demo.graphql.domain.word.WordRepo;
import r.demo.graphql.response.DefaultResponse;
import r.demo.graphql.types.Paragraph;

import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Set;

@Gql
@Service
public class ContentDataFetcher {
    private final UserInfoRepo userRepo;
    private final ContentRepo contentRepo;
    private final WordRepo wordRepo;
    private final SentenceRepo sentenceRepo;
    private final CategoryRepo categoryRepo;

    public ContentDataFetcher(UserInfoRepo userRepo, ContentRepo contentRepo,
                              WordRepo wordRepo, SentenceRepo sentenceRepo, CategoryRepo categoryRepo) {
        this.userRepo = userRepo;
        this.contentRepo = contentRepo;
        this.wordRepo = wordRepo;
        this.sentenceRepo = sentenceRepo;
        this.categoryRepo = categoryRepo;
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
                    wordRepo.save(Word.builder().content(content).eng(word.getEng()).kor(word.getKor()).sequence(i).build());
                }
                for (int i = 0; i < sentences.size(); i++) {
                    Paragraph sentence = new Paragraph(sentences.get(i));
                    sentenceRepo.save(Sentence.builder().content(content).eng(sentence.getEng()).kor(sentence.getKor()).sequence(i).build());
                }

                return new DefaultResponse(200);
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
        return environment -> contentRepo.findAll();
    }

    public boolean deleteContentDetails(long contentKey) {
        try {
            Content content = contentRepo.findById(contentKey).orElseThrow(IndexOutOfBoundsException::new);
            if (!wordRepo.disconnectWithParent(content) || !sentenceRepo.disconnectWithParent(content))
                throw new IndexOutOfBoundsException();

            contentRepo.delete(content);
            return true;
        } catch (RuntimeException e) {
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return false;
        }
    }
}
