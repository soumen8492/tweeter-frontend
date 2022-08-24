import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  //followingAccounts: null,
  followerAccounts: null,
};





export const getAllAccounts = createAsyncThunk(
  "/api1/API/v1.0/tweets/get",
  async (thunkAPI) => {
    const response = await axios({
      method: "get",
      url: "/api1/API/v1.0/tweets/get",
    });
    console.log("response ==> "+response.data);
    return response.data;
  }
);
export const getAccountsByUser = createAsyncThunk(
  "/api1/API/v1.0/tweets/search",
  async ({userName},thunkAPI) => {
    const response = await axios({
      method: "get",
      url: "/api1/API/v1.0/tweets/search/"+userName,
    });
    console.log("response ==> "+response);
    return response;
  }
);


export const AccountSlice = createSlice({
  name: "AccountSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllAccounts.fulfilled, (state, action) => {
      state.followerAccounts = action.payload;
    });
    builder.addCase(getAccountsByUser.fulfilled, (state, action) => {
      console.log("search result ==>"+action.payload.config.response);
      state.followerAccounts = action.payload.response;
    });
  },
});

export default AccountSlice.reducer;
