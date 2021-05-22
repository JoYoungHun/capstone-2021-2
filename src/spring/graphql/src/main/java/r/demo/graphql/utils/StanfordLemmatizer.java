package r.demo.graphql.utils;

import edu.stanford.nlp.ling.CoreLabel;
import edu.stanford.nlp.pipeline.CoreDocument;
import edu.stanford.nlp.pipeline.CoreSentence;
import edu.stanford.nlp.pipeline.StanfordCoreNLP;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import r.demo.graphql.domain.word.Word;
import r.demo.graphql.domain.word.WordRepo;
import r.demo.graphql.types.Document;
import r.demo.graphql.types.Paragraph;

import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class StanfordLemmatizer {
    private final StanfordCoreNLP stanfordCoreNLP;
    private final WordRepo wordRepo;

    public CoreDocument parse(@NonNull String captions) {
        CoreDocument coreDocument;
        try {
            if ("".equals(captions)) throw new IllegalArgumentException();
            coreDocument = new CoreDocument(captions);
            stanfordCoreNLP.annotate(coreDocument);

            return coreDocument;
        } catch (Exception e) {
            return null;
        }
    }

    public CoreLabel getCoreLabel(@NonNull String word) {
        CoreDocument coreDocument;
        try {
            if ("".equals(word)) return null;
            coreDocument = new CoreDocument(word);
            stanfordCoreNLP.annotate(coreDocument);

            return coreDocument.tokens().get(0);
        } catch (Exception e) {
            return null;
        }
    }

    public List<Paragraph> lemmatize(@NonNull String text) {
        CoreDocument coreDocument;

        try {
            if ("".equals(text) || text.length() < 2) throw new IllegalArgumentException();
            coreDocument = new CoreDocument(text);
            stanfordCoreNLP.annotate(coreDocument);
            List<CoreLabel> labels = coreDocument.tokens();

            List<Paragraph> paragraphs = new ArrayList<>();
            Set<String> duplicated = new HashSet<>();
            for (CoreLabel label : labels) {
                // lemmatize original text(word)
                String lemma = label.lemma();
                if (!duplicated.contains(lemma)) {
                    duplicated.add(lemma);
                    paragraphs.add(new Paragraph(lemma, wordRepo.findLatestKorMeaning(lemma).map(Word::getKor).orElse(""), label.tag()));
                }
            }

            return paragraphs;
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    public List<CoreLabel> getPartOfSpeechAboutSentence(@org.springframework.lang.NonNull String sentence) {
        CoreDocument coreDocument;
        if (sentence.equals("") || sentence.length() < 1) return null;
        try {
            coreDocument = stanfordCoreNLP.processToCoreDocument(sentence);
            return coreDocument.tokens();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public String partOfSpeech(@org.springframework.lang.NonNull String pos) {
        if (pos.startsWith("NNP") || pos.startsWith("W") || pos.startsWith("P")) return "pron.";
        else if (pos.startsWith("N")) return "n.";
        else if (pos.startsWith("V") || pos.startsWith("UH")) return "v.";
        else if (pos.startsWith("D")) return "a.";
        else if (pos.startsWith("R")) return "ad.";
        else if (pos.startsWith("J")) return "conj.";
        else if (pos.startsWith("I")) return "i.";
        else return "";
    }
}
