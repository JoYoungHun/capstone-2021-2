package r.demo.graphql.core;

import graphql.schema.DataFetcher;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.interceptor.TransactionAspectSupport;
import r.demo.graphql.annotation.Gql;
import r.demo.graphql.annotation.GqlDataFetcher;
import r.demo.graphql.annotation.GqlType;
import r.demo.graphql.domain.content.Content;
import r.demo.graphql.domain.content.ContentRepo;
import r.demo.graphql.domain.report.Report;
import r.demo.graphql.domain.report.ReportRepo;
import r.demo.graphql.domain.user.UserInfo;
import r.demo.graphql.domain.user.UserInfoRepo;
import r.demo.graphql.response.DefaultResponse;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Optional;

@Gql
@Service
public class ReportDataFetcher {
    private final ReportRepo reportRepo;
    private final ContentRepo contentRepo;
    private final UserInfoRepo userRepo;

    public ReportDataFetcher(ReportRepo reportRepo, ContentRepo contentRepo, UserInfoRepo userRepo) {
        this.reportRepo = reportRepo;
        this.contentRepo = contentRepo;
        this.userRepo = userRepo;
    }

    @GqlDataFetcher(type = GqlType.MUTATION)
    @SuppressWarnings("unchecked")
    public DataFetcher<?> rewrite() {
        return environment -> {
            LinkedHashMap<String, Object> input = environment.getArgument("input");
            long contentKey = Long.parseLong(input.get("content").toString());
            int level = Integer.parseInt(input.get("level").toString());
            List<LinkedHashMap<String, Object>> solved = (List<LinkedHashMap<String, Object>>) input.get("solved");
            try {
                Content content = contentRepo.findById(contentKey).orElseThrow(IllegalArgumentException::new);
                String email = SecurityContextHolder.getContext().getAuthentication().getName();
                UserInfo user = userRepo.findByEmail(email).orElseThrow(IllegalArgumentException::new);
                int wordLen = content.getWords().size(), sentenceLen = content.getSentences().size();
                int passed = (int) solved.stream().filter(prob -> Boolean.parseBoolean(prob.get("passed").toString())).count();
                Optional<Report> rewrite = reportRepo.findByContentAndUser(content, user);
                // if exists, rewrite (update) report entity
                // if not exists, make new report entity
                Report report = rewrite.orElseGet(() -> Report.builder()
                        .content(content).user(user).wordLen(wordLen * 3).sentenceLen(sentenceLen * 2)
                        .build());

                // toggle solved level, correct words
                switch (level) {
                    case 0:
                        report.setCorrectWordsLev1(passed);
                        report.toggleWordPassLev1();
                        break;
                    case 1:
                        report.setCorrectWordsLev2(passed);
                        report.toggleWordPassLev2();
                        break;
                    case 2:
                        report.setCorrectWordsLev3(passed);
                        report.toggleWordPassLev3();
                        break;
                    case 3:
                        report.setCorrectSentencesLev1(passed);
                        report.toggleSentencePassLev1();
                        break;
                    case 4:
                        report.setCorrectSentencesLev2(passed);
                        report.toggleSentencePassLev2();
                        break;
                    default: throw new IllegalArgumentException();
                }

                reportRepo.save(report);
                return new DefaultResponse(HttpStatus.OK.value());
            } catch (RuntimeException e) {
                e.printStackTrace();
                return new DefaultResponse(HttpStatus.NOT_FOUND.value(), e.getMessage());
            } catch (Exception e) {
                e.printStackTrace();
                TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
                return new DefaultResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage());
            }
        };
    }
}
