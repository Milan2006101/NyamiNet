import { Routes, Route, Navigate} from "react-router-dom";
import MainNoLogin from "../components/main/mainNoLogin.jsx";
import MainLogin from "../components/main/mainLogin.jsx";
import MainMyRecipes from "../components/main/mainMyRecipes.jsx";
import Login from "../components/login_register/login.jsx";
import Register from "../components/login_register/register.jsx";
import Profile from "../components/profile/profile.jsx";
import ProfileAdmin from "../components/profile/profile_admin.jsx";
import Upload from "../components/upload/upload.jsx";
import MainSaved from "../components/main/mainSaved.jsx";
import RecipePage from "../components/recipe/recipe.jsx";
import AdminReportList from "../components/admin/AdminReportList.jsx";
import AdminReportDetail from "../components/admin/AdminReportDetail.jsx";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<MainNoLogin />} />
 
      <Route path="/login" element={<Login />} />
 
      <Route path="/mainlogin" element={<MainLogin />} />

      <Route path="/my-recipes" element={<MainMyRecipes />} />
 
      <Route path="/register" element={<Register />} />

      <Route path="/profile" element={<Profile />} />

      <Route path="/profile_admin" element={<ProfileAdmin />} />

      <Route path="/upload" element={<Upload />} />

      <Route path="/saved" element={<MainSaved />} />
      
      <Route path="/recipe/:poszt_id" element={<RecipePage />} />

      <Route path="/admin/reports" element={<AdminReportList />} />
      <Route path="/admin/report/:poszt_id" element={<AdminReportDetail />} />
 
    </Routes>
  );
}