import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  followingPosts: null,
};

export const getFollowingPosts = createAsyncThunk(
  "/api2/API/v1.0/tweets/all",
  async (thunkAPI) => {
    console.log("hi hi");
    const response = await axios({
      method: "get",
      url: "/api2/API/v1.0/tweets/all",
      headers: {
        "token": localStorage.getItem("token"),
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
    console.log("hi hi hi");
    console.log(response);
    return response.data;
 
  }
);

async function insertComment(postId, commentContent) {
  console.log(commentContent);
  const response = await axios({
    method: "post",
    url: "/api2/API/v1.0/tweets/"+localStorage.getItem("userName")+"/reply/"+postId,
    headers: {
      "token": localStorage.getItem("token"),
      "Content-Type": "text/plain",
    },
    data:  commentContent,
  });
}
async function updateLove(postId, currentUserId) {
    console.log("ami kurrent : "+currentUserId);
    const response = await axios({
        method: "put",
        url: "/api2/API/v1.0/tweets/"+currentUserId+"/like/"+postId,
        headers: {
          "token": localStorage.getItem("token"),
        },
        
    });
    
    return response.data;
}
async function updateUnLove(postId, currentUserId) {
  const response = await axios({
      method: "put",
      url: "/api2/API/v1.0/tweets/"+localStorage.getItem("userName")+"/unlike/"+postId,
      headers: {
        "token": localStorage.getItem("token"),
      },
      
  });
  
  return response.data;
}


export const PostSlice = createSlice({
  name: "PostSlice",
  initialState,
  reducers: {
      addLove: (state, action) => {
        if (state.followingPosts !== null) {
            for (let i = 0; i < state.followingPosts.length; i++) {
              console.log("haa ami gadha "+state.followingPosts[i].tweetId+" post "+action.payload.postId);
                if (state.followingPosts[i].tweetId === action.payload.postId) {
                  console.log("llz "+state.followingPosts[i].likes);
                    if(state.followingPosts[i].likes===null){
                      state.followingPosts[i].likes=[action.payload.userId];
                      updateLove(action.payload.postId, action.payload.userId);
                    }
                    else if (!state.followingPosts[i].likes.includes(action.payload.userId)) {
                        state.followingPosts[i].likes.push(action.payload.userId);
                        updateLove(action.payload.postId, action.payload.userId);
                    } else {
                      console.log(state.followingPosts[i].likes);
                        state.followingPosts[i].likes = state.followingPosts[i].likes.filter(item => item !== action.payload.userId);
                        updateUnLove(action.payload.postId, action.payload.userId);
                    }
                }
            }
        }
      },

      addComment: (state, action) => {
        if (state.followingPosts !== null) {
          for (let i = 0; i < state.followingPosts.length; i++) {
            if (state.followingPosts[i].tweetId === action.payload.postId) {
              if(state.followingPosts[i].replies===null){
                state.followingPosts[i].replies=[action.payload.newComment.content];
              }
              else{
                state.followingPosts[i].replies.push(action.payload.newComment.content);
              }
              console.log(action.payload.newComment.content);
              insertComment(action.payload.postId, action.payload.newComment.content);
            }
          }
        }
      }
  },
  extraReducers: (builder) => {
    builder.addCase(getFollowingPosts.fulfilled, (state, action) => {
      state.followingPosts = action.payload;
    });
  },
});

export const {addLove, addComment} = PostSlice.actions;
export default PostSlice.reducer;
