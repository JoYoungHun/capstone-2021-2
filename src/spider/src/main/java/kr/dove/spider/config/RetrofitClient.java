package kr.dove.spider.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import kr.dove.spider.core.Apis;
import org.springframework.stereotype.Component;
import retrofit2.Retrofit;
import retrofit2.converter.jackson.JacksonConverterFactory;

@Component
public class RetrofitClient {
    private static final String FLASK_SERVER_ADDRESS = "http://localhost:5000";

    public static Apis getApis() {
        return getInstance().create(Apis.class);
    }

    private static Retrofit getInstance() {
        Gson gson = new GsonBuilder()
                .setLenient()
                .create();

        return new Retrofit.Builder()
                .baseUrl(FLASK_SERVER_ADDRESS)
                .addConverterFactory(JacksonConverterFactory.create(new ObjectMapper()))
                .build();
    }
}
