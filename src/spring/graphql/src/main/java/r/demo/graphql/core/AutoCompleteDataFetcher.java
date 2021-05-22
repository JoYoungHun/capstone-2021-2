package r.demo.graphql.core;

import graphql.schema.DataFetcher;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import r.demo.graphql.annotation.Gql;
import r.demo.graphql.annotation.GqlDataFetcher;
import r.demo.graphql.annotation.GqlType;
import r.demo.graphql.domain.documents.autocomplete.Neuron;
import r.demo.graphql.domain.documents.autocomplete.NeuronRepository;
import r.demo.graphql.domain.user.UserInfo;
import r.demo.graphql.domain.user.UserInfoRepo;
import r.demo.graphql.response.DefaultResponse;
import r.demo.graphql.response.Synapse;
import r.demo.graphql.types.Link;
import r.demo.graphql.types.Node;
import r.demo.graphql.utils.InternalFilterChains;

import java.util.*;
import java.util.stream.Collectors;

@Gql
@Service
public class AutoCompleteDataFetcher {
    private final InternalFilterChains chains;
    private final UserInfoRepo userRepo;
    private final NeuronRepository neuronRepository;

    public AutoCompleteDataFetcher(InternalFilterChains chains,
                                   UserInfoRepo userRepo, NeuronRepository neuronRepository) {
        this.chains = chains;
        this.userRepo = userRepo;
        this.neuronRepository = neuronRepository;
    }

    @GqlDataFetcher(type = GqlType.MUTATION)
    public DataFetcher<?> remember() {
        return environment -> {
            String keyword = environment.getArgument("keyword");
            Calendar c = Calendar.getInstance();
            try {
                HttpStatus isAuthenticated = chains.doFilter(Arrays.asList("ROLE_ADMIN", "ROLE_USER", "ROLE_READONLY"));
                if (isAuthenticated.equals(HttpStatus.OK)) {
                    // remove special characters
                    keyword = keyword.replaceAll("[ !@#$%^&*(),.?\"':{}|<>]", "");
                    String email = SecurityContextHolder.getContext().getAuthentication().getName();
                    UserInfo user = userRepo.findByEmail(email).orElseThrow(IllegalArgumentException::new);

                    Optional<Neuron> existing = neuronRepository.findByUserAndWord(user.getId(), keyword);
                    if (existing.isPresent()) {
                        existing.get().setRecall(c.getTime());
                        existing.get().setClicked(existing.get().getClicked() + 1L);
                        neuronRepository.save(existing.get());
                    } else {
                        neuronRepository.save(Neuron.builder()
                                .id(String.valueOf(neuronRepository.count())).word(keyword).user(user.getId())
                                .synapse(tokenize(keyword)).recall(c.getTime()).clicked(1L).build());
                    }

                    return new DefaultResponse(HttpStatus.OK);
                } else {
                    return new DefaultResponse(HttpStatus.UNAUTHORIZED);
                }
            } catch (Exception e) {
                return new DefaultResponse(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        };
    }

    @GqlDataFetcher(type = GqlType.QUERY)
    public DataFetcher<?> synapses() {
        return environment -> {
            String centralNeuron = environment.getArgument("keyword");
            int neuronsToRender = environment.getArgument("renderItem");
            List<Node> nodes = Collections.emptyList();
            List<Link> links = Collections.emptyList();

            try {
                HttpStatus isAuthenticated = chains.doFilter(Arrays.asList("ROLE_ADMIN", "ROLE_USER", "ROLE_READONLY"));
                if (isAuthenticated.equals(HttpStatus.OK)) {
                    String email = SecurityContextHolder.getContext().getAuthentication().getName();
                    UserInfo user = userRepo.findByEmail(email).orElseThrow(IllegalArgumentException::new);

                    final String trimmedCN = centralNeuron.replaceAll("[ !@#$%^&*(),.?\"':{}|<>]", "");
                    List<Neuron> neurons = neuronRepository.findAllByUserAndSynapseContains(user.getId(), trimmedCN);
                    neurons.sort((n1, n2) -> Float.compare(weight(n2), weight(n1)));
                    // rank algo applied
                    List<Neuron> iRememberThese = neurons.stream().limit(neuronsToRender).collect(Collectors.toList());

                    nodes = iRememberThese.stream().map(n -> new Node(n, weight(n))).collect(Collectors.toList());
                    links = new ArrayList<>();
                }
                return new Synapse(nodes, links);
            } catch (Exception e) {
                return new Synapse(Collections.emptyList(), Collections.emptyList());
            }
        };
    }

    private Set<String> tokenize(String s) {
        // trim blank spaces
        s = s.replaceAll(" ", "");
        Set<String> tokens = new HashSet<>();
        int window = 1;

        while (window <= s.length()) {
            for (int i = 0; i <= s.length() - window; i++)
                tokens.add(s.substring(i, i + window));
            window++;
        }

        return tokens;
    }

    private float weight(Neuron n) {
        Calendar c = Calendar.getInstance();
        // 해당 단어를 접한 최근 일자와 현재와 비교
        // unit : minute
        float diff = (c.getTime().getTime() - n.getRecall().getTime()) / 60000f;
        float repeated = n.getClicked() / 100f;

        // normalize between 0.0333... ~ 1
        diff = diff / (30 * 30 * 1440f);
//        System.out.printf("%f, %f\n", diff, repeated);
        return Math.min(repeated, 1.0f) * 0.4f - diff * 0.6f;
    }
}
