import { Navigate, RouterProvider } from 'react-router-dom'
import { createBrowserRouter } from "react-router-dom";
import Home from '../pages/home/page';
import { useAuth } from '../hooks/auth-provider';
import Login from '../pages/login/page';
import Register from '../pages/register/page';
import Chats from '../pages/chats/page';
import ChatSideBar from '../pages/chats/components/chat-sidebar';
import AllGroupSidebar from '../pages/chats/components/all-groupsidebar';
import AllUsersSideBar from '../pages/chats/components/all-usersidebar';
import GroupUsersSideBar from '../pages/chats/components/group-users-sidebar';
import ChatsConsole from '../pages/chats/components/chats-console';
import ProfilePage from '../pages/profile/page';
import GeminiWraper from '../pages/chats/gemini/gemini-chats-wraper';

export default function RouterComponent() {

  const { isLogin } = useAuth()
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      //   TODO : add this
      //   errorElement:<ErrorPage/>

    },
    // chats
    {
      path: "/chats",
      element: isLogin ? <Chats /> : <Navigate to="/login" replace />,
      children: [
        {
          path: "all-groups",
          element: <AllGroupSidebar />
        },
        {
          path: "all-users",
          element: <AllUsersSideBar />
        },
        {
          path: "profile",
          element:  <ProfilePage />
        },
        {
          path: "gemini",
          element:  <GeminiWraper />
        },

        {
          path: ":id",
          element: <ChatSideBar />,
          children: [
            {
              index: true,
              element: <ChatsConsole />
            },
            {
              path: "add-users",
              element: <AllUsersSideBar isForAddDelete={true} />
            },
            {
              path: "users",
              element: <GroupUsersSideBar />
            }
          ]
        },



      ]

    },
    // auths
    {
      path: "/login",
      element: !isLogin ? <Login /> : <Navigate to="/chats" />
    },
    {
      path: "/register",
      element: !isLogin ? <Register /> : <Navigate to="/chats" />
    }
  ]);


  return (
    <RouterProvider router={router} />
  )
}
