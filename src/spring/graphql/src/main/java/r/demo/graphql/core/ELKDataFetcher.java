package r.demo.graphql.core;

import com.google.cloud.translate.v3.Translation;
import graphql.schema.DataFetcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import r.demo.graphql.annotation.Gql;
import r.demo.graphql.annotation.GqlDataFetcher;
import r.demo.graphql.annotation.GqlType;
import r.demo.graphql.config.GoogleTranslationClient;
import r.demo.graphql.domain.content.Content;
import r.demo.graphql.domain.content.ContentRepo;
import r.demo.graphql.domain.documents.video.Video;
import r.demo.graphql.domain.documents.video.VideoRepository;
import r.demo.graphql.domain.user.UserInfo;
import r.demo.graphql.domain.user.UserInfoRepo;
import r.demo.graphql.domain.viewed.Viewed;
import r.demo.graphql.domain.viewed.ViewedRepo;
import r.demo.graphql.response.BubbleResponse;
import r.demo.graphql.types.Bubble;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Gql
@Service
public class ELKDataFetcher {
    private final GoogleTranslationClient googleTranslationClient;
    private final VideoRepository videoRepository;
    private final ContentRepo contentRepo;
    private final UserInfoRepo userRepo;
    private final ViewedRepo viewedRepo;

    public ELKDataFetcher(GoogleTranslationClient googleTranslationClient, VideoRepository videoRepository,
                          ContentRepo contentRepo, UserInfoRepo userRepo, ViewedRepo viewedRepo) {
        this.googleTranslationClient = googleTranslationClient;
        this.videoRepository = videoRepository;
        this.contentRepo = contentRepo;
        this.userRepo = userRepo;
        this.viewedRepo = viewedRepo;
    }

    // 한글 검색어에 대해 영어로 변환 (Data 가 영어 text 로 구성돼있음.)
    // 이후 영어 검색어에 대한 search query 수행
    @GqlDataFetcher(type = GqlType.QUERY)
    public DataFetcher<?> ocean() {
        return environment -> {
            String keyword = environment.getArgument("keyword"),
                    dFilter = environment.getArgument("dFilter");
            try {
                final LinkedHashMap<String, Object> req = environment.getArgument("pr");
                int page = Integer.parseInt(req.get("page").toString()),
                        renderItem = Integer.parseInt(req.get("renderItem").toString());
                PageRequest pageRequest = PageRequest.of(page - 1, renderItem, Sort.Direction.DESC, "created");
                if (keyword == null) keyword = "";
                else {
                    String translatedEng = "";
                    try {
                        // keyword to english
                        translatedEng = googleTranslationClient.getTranslatedParagraphs(keyword, "en")
                                .stream().map(Translation::getTranslatedText).collect(Collectors.joining(" "));
                    } catch (RuntimeException ignored) {
                    } finally {
                        keyword = translatedEng;
                    }
                }
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                Page<Video> videos = dFilter == null ?
                        "".equals(keyword) ? videoRepository.findAll(pageRequest)
                                : videoRepository.findAllByCaptionsInOrTitleIn(keyword, keyword, pageRequest)
                        :
                        "".equals(keyword) ? videoRepository.findAllByCreatedBetween(sdf.parse(dFilter.concat(" 00:00:00")), sdf.parse(dFilter.concat(" 23:59:59")), pageRequest)
                                : videoRepository.findAllByCaptionsInAndCreatedBetweenOrTitleInAndCreatedBetween(
                                keyword, sdf.parse(dFilter.concat(" 00:00:00")), sdf.parse(dFilter.concat(" 23:59:59")),
                                        keyword, sdf.parse(dFilter.concat(" 00:00:00")), sdf.parse(dFilter.concat(" 23:59:59")), pageRequest);
                List<Bubble> bubbles = videos.stream().map(Bubble::new).collect(Collectors.toList());
                Collections.shuffle(bubbles);
                return new BubbleResponse(bubbles, videos.getTotalPages());
            } catch (Exception e) {
                e.printStackTrace();
                return Collections.emptyList();
            }
        };
    }

    @GqlDataFetcher(type = GqlType.QUERY)
    public DataFetcher<?> bubble() {
        return environment -> {
            String id = environment.getArgument("id");
            try {
                return videoRepository.findById(id);
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        };
    }

    @GqlDataFetcher(type = GqlType.QUERY)
    public DataFetcher<?> recommended() {
        return environment -> {
            try {
                final LinkedHashMap<String, Object> req = environment.getArgument("pr");
                int renderItem = Integer.parseInt(req.get("renderItem").toString());
                String email = SecurityContextHolder.getContext().getAuthentication().getName();
                UserInfo user = userRepo.findByEmail(email).orElseThrow(IllegalArgumentException::new);

                List<Viewed> recent = viewedRepo.findAllByUser(user, PageRequest.of(0, renderItem, Sort.Direction.DESC, "created"))
                        .stream().limit(4L).collect(Collectors.toList());
                List<String> recommended = new ArrayList<>();
                for (Viewed viewed : recent) {
                    try {
                        Content content = viewed.getContent();
                        Video criteria = videoRepository.save(Video.builder().id("-1").title(content.getTitle()).captions(content.getCaptions()).ref(content.getRef()).build());
                        Page<Video> similar = videoRepository.searchSimilar(criteria, new String[]{ "captions", "title" }, PageRequest.of(0, 4));
                        recommended.addAll(similar.stream().limit(4).map(Video::getId).collect(Collectors.toList()));
                        videoRepository.delete(criteria);
                    } catch (RuntimeException ignored) { }
                }
                List<Bubble> bubbles = new ArrayList<>();
                for (String docId : recommended) {
                    try {
                        bubbles.add(videoRepository.findById(docId).map(Bubble::new).orElseThrow(IllegalArgumentException::new));
                    } catch (RuntimeException ignored) { }
                }
                int rand = (int) Math.round(Math.random());
                bubbles.addAll(videoRepository.findAll(PageRequest.of(0, renderItem, rand == 0 ? Sort.Direction.ASC : Sort.Direction.DESC, "created"))
                        .stream().map(Bubble::new).collect(Collectors.toList()));
                Collections.shuffle(bubbles);
                return bubbles.stream().limit(renderItem).collect(Collectors.toList());
            } catch (RuntimeException e) {
                e.printStackTrace();
                return Collections.emptyList();
            }
        };
    }
}
