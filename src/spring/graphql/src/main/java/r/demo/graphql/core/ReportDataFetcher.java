package r.demo.graphql.core;

import graphql.schema.DataFetcher;
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
import r.demo.graphql.domain.content.Content;
import r.demo.graphql.domain.content.ContentRepo;
import r.demo.graphql.domain.report.Report;
import r.demo.graphql.domain.report.ReportRepo;
import r.demo.graphql.domain.user.UserInfo;
import r.demo.graphql.domain.user.UserInfoRepo;
import r.demo.graphql.response.BarResponse;
import r.demo.graphql.response.DefaultResponse;
import r.demo.graphql.response.PieResponse;
import r.demo.graphql.response.RadarResponse;
import r.demo.graphql.types.BarDataType;
import r.demo.graphql.types.PieDataType;
import r.demo.graphql.types.RadarDataType;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

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

    @GqlDataFetcher(type = GqlType.QUERY)
    public DataFetcher<?> report() {
        return environment -> {
            long reportKey = environment.getArgument("report");
            try {
                return reportRepo.findById(reportKey).orElseThrow(IllegalArgumentException::new);
            } catch (RuntimeException e) {
                return null;
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        };
    }

    @GqlDataFetcher(type = GqlType.QUERY)
    public DataFetcher<?> bar() {
        return environment -> {
            long reportKey = environment.getArgument("report");
            try {
                Report report = reportRepo.findById(reportKey).orElseThrow(IllegalArgumentException::new);
                List<Report> otherReports = reportRepo.findAllByIdNotAndContent(reportKey, report.getContent());

                // summarize
                List<BarDataType> data = new ArrayList<>();
                data.add(summarizeToBar(otherReports, "평균 정답률"));
                data.add(summarizeToBar(Collections.singletonList(report), "내 정답률"));

                return new BarResponse(HttpStatus.OK.value(), data);
            } catch (RuntimeException e) {
                return new BarResponse(HttpStatus.NOT_FOUND.value());
            } catch (Exception e) {
                e.printStackTrace();
                return new BarResponse(HttpStatus.INTERNAL_SERVER_ERROR.value());
            }
        };
    }

    @GqlDataFetcher(type = GqlType.QUERY)
    public DataFetcher<?> pie() {
        return environment -> {
            long reportKey = environment.getArgument("report");
            int option = environment.getArgument("option");
            try {
                Report report = reportRepo.findById(reportKey).orElseThrow(IllegalArgumentException::new);
                return new PieResponse(HttpStatus.OK.value(), summarizeToPie(report, option));
            } catch (RuntimeException e) {
                return new PieResponse(HttpStatus.NOT_FOUND.value());
            } catch (Exception e) {
                e.printStackTrace();
                return new PieResponse(HttpStatus.INTERNAL_SERVER_ERROR.value());
            }
        };
    }

    @GqlDataFetcher(type = GqlType.QUERY)
    public DataFetcher<?> radar() {
        return environment -> {
            long reportKey = environment.getArgument("report");
            try {
                Report report = reportRepo.findById(reportKey).orElseThrow(IllegalArgumentException::new);
                return new RadarResponse(HttpStatus.OK.value(), summarizeToRadar(report));
            } catch (RuntimeException e) {
                return new RadarResponse(HttpStatus.NOT_FOUND.value());
            } catch (Exception e) {
                e.printStackTrace();
                return new RadarResponse(HttpStatus.INTERNAL_SERVER_ERROR.value());
            }
        };
    }

    @GqlDataFetcher(type = GqlType.QUERY)
    public DataFetcher<?> recent() {
        return environment -> {
            LinkedHashMap<String, Object> lhm = new LinkedHashMap<>();
            final LinkedHashMap<String, Object> req = environment.getArgument("pr");
            int page = Integer.parseInt(req.get("page").toString()),
                    renderItem = Integer.parseInt(req.get("renderItem").toString());
            try {
                String email = SecurityContextHolder.getContext().getAuthentication().getName();
                UserInfo user = userRepo.findByEmail(email).orElseThrow(IllegalArgumentException::new);
                Page<Report> reports = reportRepo.findAllByUser(user, PageRequest.of(page - 1, renderItem, Sort.Direction.DESC, "modified"));
                lhm.put("reports", reports);
                lhm.put("totalElements", reports.getTotalElements());
            } catch (RuntimeException e) {
                lhm.put("reports", Collections.emptyList());
                lhm.put("totalElements", 0);
            } catch (Exception e) {
                e.printStackTrace();
                lhm.put("reports", Collections.emptyList());
                lhm.put("totalElements", 0);
            }
            return lhm;
        };
    }

    public BarDataType summarizeToBar(List<Report> reports, String label) {
        BigDecimal accLevel1 = new BigDecimal("0"), accLevel2 = new BigDecimal("0"), accLevel3 = new BigDecimal("0"),
                accObjective = new BigDecimal("0"), accSubjective = new BigDecimal("0"), 
                wordDenominator = new BigDecimal("0"), sentenceDenominator = new BigDecimal("0");
        for (Report report : reports) {
            if (report.getWordLen() > 0) {
                accLevel1 = accLevel1.add(new BigDecimal(String.valueOf(report.getCorrectWordsLev1() / (report.getWordLen() / 3f))));
                accLevel2 = accLevel2.add(new BigDecimal(String.valueOf(report.getCorrectWordsLev2() / (report.getWordLen() / 3f))));
                accLevel3 = accLevel3.add(new BigDecimal(String.valueOf(report.getCorrectWordsLev3() / (report.getWordLen() / 3f))));
                
                wordDenominator = wordDenominator.add(new BigDecimal("1"));
            }
            if (report.getSentenceLen() > 0) {
                accObjective = accObjective.add(new BigDecimal(String.valueOf(report.getCorrectSentencesLev1() / (report.getSentenceLen() / 2f))));
                accSubjective = accSubjective.add(new BigDecimal(String.valueOf(report.getCorrectSentencesLev2() / (report.getSentenceLen() / 2f))));
                
                sentenceDenominator = sentenceDenominator.add(new BigDecimal("1"));
            }
        }
        return BarDataType.builder()
                .label(label)
                .level1(wordDenominator.intValue() != 0 ?
                        accLevel1.divide(wordDenominator, 2, RoundingMode.HALF_UP).multiply(new BigDecimal("100")).floatValue() : 0f)
                .level2(wordDenominator.intValue() != 0 ?
                        accLevel2.divide(wordDenominator, 2, RoundingMode.HALF_UP).multiply(new BigDecimal("100")).floatValue() : 0f)
                .level3(wordDenominator.intValue() != 0 ?
                        accLevel3.divide(wordDenominator, 2, RoundingMode.HALF_UP).multiply(new BigDecimal("100")).floatValue() : 0f)
                .objective(sentenceDenominator.intValue() != 0 ?
                        accObjective.divide(sentenceDenominator, 2, RoundingMode.HALF_UP).multiply(new BigDecimal("100")).floatValue() : 0f)
                .subjective(sentenceDenominator.intValue() != 0 ?
                        accSubjective.divide(sentenceDenominator, 2, RoundingMode.HALF_UP).multiply(new BigDecimal("100")).floatValue() : 0f)
                .build();
    }

    public List<PieDataType> summarizeToPie(Report report, int option) throws IllegalArgumentException {
        List<PieDataType> data = new ArrayList<>();
        float passed, total;
        switch (option) {
            case 0:
                // View all statistics
                passed = report.getCorrectWordsLev1() + report.getCorrectWordsLev2() + report.getCorrectWordsLev3()
                        + report.getCorrectSentencesLev1() + report.getCorrectSentencesLev2();
                total = report.getWordLen() + report.getSentenceLen();
                break;
            case 1:
                // Word statistics lookup
                passed = report.getCorrectWordsLev1() + report.getCorrectWordsLev2() + report.getCorrectWordsLev3();
                total = report.getWordLen();
                break;
            case 2:
                // Sentence statistics lookup
                passed = report.getCorrectSentencesLev1() + report.getCorrectSentencesLev2();
                total = report.getSentenceLen();
                break;
            default: throw new IllegalArgumentException();
        }

        float correctPct = total == 0f ? 0f :
                new BigDecimal(String.valueOf(passed)).divide(new BigDecimal(String.valueOf(total)), 2, RoundingMode.HALF_UP).floatValue() * 100f;
        data.add(PieDataType.builder().id("correctness").label("correctness").color("hsl(189, 70%, 50%)").value(correctPct).build());
        data.add(PieDataType.builder().id("failure").label("failure").color("hsl(54, 70%, 50%)").value(100f - correctPct).build());
        return data;
    }

    public List<RadarDataType> summarizeToRadar(Report report) {
        List<RadarDataType> data = new ArrayList<>();
        int totalWords = report.getWordLen(), totalSentences = report.getSentenceLen();
        int perLevWords = totalWords == 0 ? 0 : totalWords / 3, perLevSentences = totalSentences == 0 ? 0 : totalSentences / 2;

        data.add(RadarDataType.builder().taste("단어 level 1").total(1)
                .correct(perLevWords == 0 ? 0f : new BigDecimal(report.getCorrectWordsLev1()).divide(new BigDecimal(perLevWords), 2, RoundingMode.HALF_UP).floatValue()).build());
        data.add(RadarDataType.builder().taste("단어 level 2").total(1)
                .correct(perLevWords == 0 ? 0f : new BigDecimal(report.getCorrectWordsLev2()).divide(new BigDecimal(perLevWords), 2, RoundingMode.HALF_UP).floatValue()).build());
        data.add(RadarDataType.builder().taste("단어 level 3").total(1)
                .correct(perLevWords == 0 ? 0f : new BigDecimal(report.getCorrectWordsLev3()).divide(new BigDecimal(perLevWords), 2, RoundingMode.HALF_UP).floatValue()).build());
        data.add(RadarDataType.builder().taste("객관식 문장").total(1)
                .correct(perLevSentences == 0 ? 0f : new BigDecimal(report.getCorrectSentencesLev1())
                        .divide(new BigDecimal(perLevSentences), 2, RoundingMode.HALF_UP).floatValue()).build());
        data.add(RadarDataType.builder().taste("주관식 문장").total(1)
                .correct(perLevSentences == 0 ? 0f : new BigDecimal(report.getCorrectSentencesLev2())
                        .divide(new BigDecimal(perLevSentences), 2, RoundingMode.HALF_UP).floatValue()).build());

        return data;
    }
}
