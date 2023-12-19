import { Outlet } from "react-router-dom"
import { Container } from "@mui/material"
import "./App.scss"

function App() {
  return (
    <Container maxWidth="sm">
      <div className="app">
        <Outlet />
      </div>
    </Container>
  )
}

export default App
