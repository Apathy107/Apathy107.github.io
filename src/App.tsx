import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AccidentList from "./pages/AccidentList";
import AccidentDetail from "./pages/AccidentDetail";
import DrawingEditor from "./pages/DrawingEditor";
import Records from "./pages/Records";
import RecordEditor from "./pages/RecordEditor";
import Statistics from "./pages/Statistics";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<AccidentList />} />
          <Route path="/accident/:id" element={<AccidentDetail />} />
          <Route path="/accident/new" element={<AccidentDetail />} />
          <Route path="/editor/:id" element={<DrawingEditor />} />
          <Route path="/records" element={<Records />} />
          <Route path="/record-editor" element={<RecordEditor />} />
          <Route path="/stats" element={<Statistics />} />
          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
  </QueryClientProvider>
);

export default App;