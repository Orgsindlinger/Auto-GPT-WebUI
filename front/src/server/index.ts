import express from "express"
import { spawn } from "child_process"

export const app = express()

if (!process.env["VITE"]) {
  const frontendFiles = process.cwd() + "/dist"
  app.use(express.static(frontendFiles))

  // spawn but no start
  let python = null as any
  let dataToSend = ""

  app.get("/api/start", (_, res) => {
    python = spawn("../venv/bin/python", ["../scripts/main.py"])
    python.stdout.on("data", function (data: any) {
      console.log(data.toString())
      dataToSend = dataToSend + data.toString()
    })
    python.on("close", (code: any) => {
      console.log(`child process close all stdio with code ${code}`)
    })
    res.json({ output: "Python script started" })
  })

  app.get("/api/data", (req, res) => {
    res.json({ output: dataToSend })
  })

  app.get("/api/stop", (_, res) => {
    python.kill()
    res.json({ output: "Python script stopped" })
  })

  app.get("/*", (_, res) => {
    res.send(frontendFiles + "/index.html")
  })

  // kill python process on exit
  process.on("exit", () => {
    python.kill()
    console.log("Python script killed")
  })
  app.listen(process.env["PORT"])
} else {
  // spawn but no start
  let python = null as any
  let dataToSend = ""

  app.get("/api/start", (_, res) => {
    python = spawn("../venv/bin/python", ["../scripts/main.py"])
    python.stdout.on("data", function (data: any) {
      console.log(data.toString())
      dataToSend = dataToSend + data.toString()
    })
    python.on("close", (code: any) => {
      console.log(`child process close all stdio with code ${code}`)
    })
    res.json({ output: "Python script started" })
  })

  app.get("/api/data", (req, res) => {
    res.json({ output: dataToSend })
  })

  app.get("/api/stop", (_, res) => {
    python.kill()
    res.json({ output: "Python script stopped" })
  })

  // kill python process on exit
  process.on("exit", () => {
    python.kill()
    console.log("Python script killed")
  })
  app.listen(3001, () => console.log("Server running on port 3001"))
}
