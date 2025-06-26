// App.jsx
import { Routes, Route } from 'react-router-dom';
import InsurEduGame from './InsurEduGame'; // ตรวจสอบ path ให้ถูกต้อง

function App() {
  return (
    <Routes>
      <Route path="/" element={<InsurEduGame />} />
    </Routes>
  );
}

export default App;