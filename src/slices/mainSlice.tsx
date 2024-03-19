import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoggedIn: false,
  userName: null,
  tasks: [],
  members: [],
};

export const fetchMembersAsync = createAsyncThunk(
  "app/fetchMembers",
  async () => {
    const authToken = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };

    try {
      const response = await axios.get(
        "http://127.0.0.1:9001/private/members/",
        {
          headers,
        }
      );
      return response.data.members;
    } catch (error) {
      console.error("Error fetching members:", error);
      throw error;
    }
  }
);

export const fetchTasksAsync = createAsyncThunk(
  "app/fetchTasks",
  async () => {
    const authToken = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };

    try {
      const response = await axios.get("http://127.0.0.1:9001/private/tasks/", {
        headers,
      });
      return response.data.tasks;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  }
);

const mainSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchMembersAsync.fulfilled, (state, action) => {
      state.members = action.payload;
    });

    builder.addCase(fetchTasksAsync.fulfilled, (state, action) => {
      state.tasks = action.payload;
    });
  },
});

export default mainSlice.reducer;
