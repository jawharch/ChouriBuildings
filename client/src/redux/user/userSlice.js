import { createSlice } from "@reduxjs/toolkit";
const initialState={
    currentUser:null,
    error:null,
    loading:false

}
const userSlice=createSlice({
    name:'user',
    initialState,
    reducers:{
        loginInStart:(state)=>
        {
            state.loading=true
        },
        loginInSuccess:(state,action)=>
        {
            state.loading=false
            state.currentUser=action.payload
            state.error=null
        },
        loginInFailure:(state,action)=>
        {
            state.error=action.payload
            state.loading=false
        },
        updateStart:(state)=>
        {
            state.loading=true
        },
        updateWithSuccess:(state,action)=>
        {
            state.currentUser=action.payload
            state.loading=false
          
            state.error=null
        },
        updateWithFailure:(state,action)=>
        {
            
            state.error=action.payload
            state.loading=false
        },
        deleteStart:(state)=>
        {
            state.loading=true
        },
        deleteWithSuccess:(state,action)=>
        {
            state.currentUser=action.payload
            state.loading=false
          
            state.error=null
        },
        deleteWithFailure:(state,action)=>
        {
            
            state.error=action.payload
            state.loading=false
        },
        logoutStart:(state)=>
        {
            state.loading=true
        },
       logoutWithSuccess:(state)=>
        {
            state.currentUser=null
            state.loading=false
          
            state.error=null
        },
        logoutWithFailure:(state,action)=>
        {
            
            state.error=action.payload
            state.loading=false
        }

    },
})
export const{loginInStart,loginInSuccess,loginInFailure,updateWithFailure,updateWithSuccess,updateStart,deleteStart,deleteWithFailure,deleteWithSuccess,logoutWithFailure,logoutStart,logoutWithSuccess}=userSlice.actions;
export default userSlice.reducer