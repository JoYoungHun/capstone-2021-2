package kr.dove.spider.core;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Query;

public interface Apis {
    @GET(value = "/transcript")
    Call<Object> transcript(@Query("videoId") String videoId);
}
