import React, { useReducer, useContext } from "react";
import reducer from "./reducer";
import {
    DISPLAY_ALERT,
    CLEAR_ALERT,
    REGISTER_USER_BEGIN,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_ERROR,
    LOGIN_USER_BEGIN,
    LOGIN_USER_ERROR,
    LOGIN_USER_SUCCESS,
    SETUP_USER_BEGIN,
    SETUP_USER_ERROR,
    SETUP_USER_SUCCESS,
    TOGGLE_SIDEBAR,
    LOGOUT_USER,
    UPDATE_USER_BEGIN,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_ERROR,
    HANDLE_CHANGE,
    CLEAR_VALUES,
    CREATE_JOB_BEGIN,
    CREATE_JOB_SUCCESS,
    CREATE_JOB_ERROR,
    GET_JOBS_BEGIN,
    GET_JOBS_SUCCESS,
    SET_EDIT_JOB,
    DELETE_JOB_BEGIN,
    EDIT_JOB_BEGIN,
    EDIT_JOB_ERROR,
    EDIT_JOB_SUCCESS,
    SHOW_STATS_BEGIN,
    SHOW_STATS_SUCCESS,
    CLEAR_FILTERS
} from "./action";
import axios from "axios";

const token = localStorage.getItem("token");
const user = localStorage.getItem("user");
const location = localStorage.getItem("location");

const initialState = {
    isLoading: false,
    showAlert: false,
    alertText: "",
    alertType: "",
    user: user === "undefined" ? null : JSON.parse(user),
    token: token,
    showSidebar: false,
    userLocation: location || "",
    isEditing: false,
    editJobId: "",
    position: "",
    company: "",
    jobLocation: location || "",
    jobTypeOptions: ["full-time", "part-time", "remote", "internship"],
    jobType: "full-time",
    statusOptions: ["interview", "declined", "pending"],
    status: "pending",
    jobs: [],
    totalJobs: 0,
    page: 1,
    numberOfPages: 1,
    stats: {},
    monthlyApplications: [],
    search: "",
    searchStatus: "all",
    searchType: "all",
    sort: "latest",
    sortOptions: ["latest", "oldest", "a-z", "z-a"]

}


const AppContext = React.createContext();


const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const authFetch = axios.create({
        baseURL: "/api/v1",
    });

    // For request
    authFetch.interceptors.request.use((config) => {
        config.headers["Authorization"] = "Bearer " + state.token;
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    // For response
    authFetch.interceptors.response.use((response) => {
        return response;
    }, (error) => {
        console.log(error.response);
        if (error.response.status === 401) {
            logoutUser();
        }
        return Promise.reject(error);
    });

    const displayAlert = () => {
        dispatch({ type: DISPLAY_ALERT });
        clearAlert();
    }

    const clearAlert = () => {
        setTimeout(() => {
            dispatch({
                type: CLEAR_ALERT,
            })
        }, 3000);
    }
    const addUsertoLocalStorage = ({ user, token, location }) => {

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        localStorage.setItem("location", location);
    }

    const removeUserFromLocalStorage = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("location");
    }

    const registerUser = async (currentUser) => {
        dispatch({ type: REGISTER_USER_BEGIN });
        try {
            const response = await axios.post("/api/v1/auth/register", currentUser);

            const { user, token, location } = response.data;
            dispatch({ type: REGISTER_USER_SUCCESS, payload: { user, token, location } });
            console.log(location);
            console.log(user);
            console.log(token);
            addUsertoLocalStorage({ user, token, location });
        } catch (error) {
            console.log(error.response);
            dispatch({ type: REGISTER_USER_ERROR, payload: { message: error.response.data.msg } })
        }
        clearAlert();
    }

    const loginUser = async (currentUser) => {
        dispatch({ type: LOGIN_USER_BEGIN });
        try {
            const { data } = await axios.post("/api/v1/auth/login", currentUser);
            const { user, token, location } = data;
            dispatch({ type: LOGIN_USER_SUCCESS, payload: { user, token, location } });
            console.log(location);
            console.log(user);
            console.log(token);
            addUsertoLocalStorage({ user, token, location });
        } catch (error) {
            console.log(error.response);
            dispatch({ type: LOGIN_USER_ERROR, payload: { message: error.response.data.msg } })
        }
        clearAlert();
    }

    const setupUser = async ({ currentUser, endPoint, alertText }) => {
        dispatch({ type: SETUP_USER_BEGIN });
        try {
            const { data } = await axios.post(`/api/v1/auth/${endPoint}`, currentUser);
            const { user, token, location } = data;
            dispatch({ type: SETUP_USER_SUCCESS, payload: { user, token, location, alertText } });
            addUsertoLocalStorage({ user, token, location });
        } catch (error) {
            console.log(error.response);
            dispatch({ type: SETUP_USER_ERROR, payload: { message: error.response.data.msg } })
        }
        clearAlert();
    }

    const toggleSidebar = () => {
        dispatch({ type: TOGGLE_SIDEBAR });
    }

    const logoutUser = () => {
        dispatch({ type: LOGOUT_USER });
        removeUserFromLocalStorage();
    }

    const updateUser = async (currentUser) => {
        dispatch({ type: UPDATE_USER_BEGIN })
        try {
            const { data } = await authFetch.patch("/auth/updateUser", currentUser);
            const { user, location, token } = data;

            dispatch({ type: UPDATE_USER_SUCCESS, payload: { user, location, token } });
            addUsertoLocalStorage({ user, location, token });
        } catch (error) {
            if (error.response.status !== 401) {
                dispatch({ type: UPDATE_USER_ERROR, payload: { message: error.response.data.message } });
            }

            //console.log(error.response);
        }
    }

    const handleChange = ({ value, name }) => {
        dispatch({ type: HANDLE_CHANGE, payload: { name, value } });
    }

    const clearValues = () => {
        dispatch({ type: CLEAR_VALUES });
    }

    const createJob = async () => {
        dispatch({ type: CREATE_JOB_BEGIN });
        try {
            const { position, company, jobLocation, jobType, status } = state;
            await authFetch.post("/jobs", {
                position,
                company,
                jobLocation,
                jobType,
                status
            });
            dispatch({ type: CREATE_JOB_SUCCESS });
            dispatch({ type: CLEAR_VALUES });
        } catch (error) {
            if (error.response.status === 401) return;
            dispatch({ type: CREATE_JOB_ERROR, payload: { message: error.response.data.message } });
        }
        clearAlert();
    }

    const getJobs = async () => {
        const {search, searchStatus, searchType, sort} = state;
        let url = "/jobs?status=" + searchStatus + "&jobType=" + searchType + "&sort=" + sort;
        if(search){
            url += "&search=" + search;
        }


        dispatch({ type: GET_JOBS_BEGIN });
        try {
            const { data } = await authFetch.get(url);
            const { jobs, totalJobs, numberOfPages } = data;
            console.log("numberOfPages appContext", numberOfPages);
            dispatch({
                type: GET_JOBS_SUCCESS, payload: {
                    jobs,
                    totalJobs,
                    numberOfPages,
                }
            });
        } catch (error) {
            console.log(error.response);
        }
        clearAlert();
    }
    const setEditJob = (id) => {
        dispatch({ type: SET_EDIT_JOB, payload: { id } });
    }

    const editJob = async () => {
        dispatch({ type: EDIT_JOB_BEGIN });
        try {
            const { position, company, jobLocation, jobType, status } = state;
            await authFetch.patch("/jobs/" + state.editJobId, {
                company, position, jobLocation, jobType, status
            });
            dispatch({type: EDIT_JOB_SUCCESS});
            dispatch({type: CLEAR_VALUES});
        } catch (error) {
            if(error.response.status === 401) return;
            dispatch({type:EDIT_JOB_ERROR, payload:{
                message: error.response.data.message
            }})
        }
        clearAlert();
    }

    const deleteJob = async (jobId) => {
        dispatch({ type: DELETE_JOB_BEGIN });
        try {
            await authFetch.delete("/jobs/" + jobId)
            getJobs();
        } catch (error) {
            console.log(error.response);
            // logoutUser();
        }
    }

    const showStats = async ()=>{
        dispatch({type:SHOW_STATS_BEGIN})
        try {
           const {data} = await authFetch.get("/jobs/stats");
           dispatch({type:SHOW_STATS_SUCCESS, payload:{
            stats: data.defaultStats,
            monthlyApplications: data.monthlyApplications,
           }});
        } catch (error) {
            console.log(error.response);
            logoutUser();
        }
        clearAlert();
    }
    const clearFilters = ()=>{
        dispatch({type: CLEAR_FILTERS});
    }
    return <AppContext.Provider value={{ ...state, clearFilters, showStats, displayAlert, registerUser, loginUser, setupUser, toggleSidebar, logoutUser, updateUser, handleChange, clearValues, createJob, getJobs, setEditJob, deleteJob, editJob }}>
        {children}
    </AppContext.Provider>
}

const useAppContext = () => {
    return useContext(AppContext);
}

export { AppProvider, initialState, useAppContext }