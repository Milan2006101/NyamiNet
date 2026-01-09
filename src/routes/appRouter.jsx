import { Routes, Route, Navigate} from "react-router-dom";
import MainNoLogin from "../components/main/mainNoLogin.jsx";
import MainLogin from "../components/main/mainLogin.jsx";
import Login from "../components/login_register/login.jsx";
import Register from "../components/login_register/register.jsx";
import Profile from "../components/profile/profile.jsx";
import ProfileAdmin from "../components/profile/profile_admin.jsx";
import Upload from "../components/upload/upload.jsx";
import MainSaved from "../components/main/mainSaved.jsx";
import RecipePage from "../components/recipe/recipe.jsx";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<MainNoLogin />} />
 
      <Route path="/login" element={<Login />} />
 
      <Route path="/mainlogin" element={<MainLogin />} />
 
      <Route path="/register" element={<Register />} />

      <Route path="/profile" element={<Profile />} />

      <Route path="/profile_admin" element={<ProfileAdmin />} />

      <Route path="/upload" element={<Upload />} />

      <Route path="/saved" element={<MainSaved />} />
      
      <Route path="/recipe" element={<RecipePage />} />
 
    </Routes>
  );
}