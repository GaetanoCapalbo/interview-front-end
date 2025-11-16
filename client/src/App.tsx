import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { Navbar } from "./components/Navbar";
import  HomePage  from "./pages/HomePage";
import EventListPage  from "./pages/EventListPage";
import EventDetailsPage  from "./pages/EventDetailPage";
import CreateEventPage from "./pages/CreateEventPage";
import EditEventPage from "./pages/EditEventPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen w-full bg-background">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventListPage />} />
          <Route path="/events/new" element={<CreateEventPage />} />
          <Route path="/events/:id" element={<EventDetailsPage />} />
          <Route path="/events/:id/edit" element={<EditEventPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
