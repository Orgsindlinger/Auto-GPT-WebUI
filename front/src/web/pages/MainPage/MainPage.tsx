import useAgents from "@/hooks/data/useAgents"
import useAiHistory from "@/hooks/data/useAiHistory"
import { Archive, Delete, PlayArrow, Stop } from "@mui/icons-material"
import CommentRoundedIcon from "@mui/icons-material/CommentRounded"
import { Chip } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router"
import AutoGPTAPI from "../../api/AutoGPTAPI"
import AgentCard from "../../components/molecules/AgentCard"
import SearchInput from "../../components/molecules/SearchInput"
import TaskCard from "../../components/molecules/TaskCard"
import Answers from "../../components/organisms/Answers"
import useAnswerInterceptor from "../../hooks/useAnswerInterceptor"
import Flex from "../../style/Flex"
import SButton from "../../style/SButton"
import IAnswer from "../../types/data/IAnswer"
import {
  ActionBar,
  CommentContainer,
  Container,
  Discussion,
  Grid,
  Input,
  InputContainer,
  RightTasks,
  SIconButton,
} from "./MainPage.styled"
import useAutoGPTAPI from "@/hooks/useAutoGPTAPI"

const MainPage = () => {
  const { aiHistoryArray, aiHistory } = useAiHistory()
  const { id } = useParams<{ id: string }>()
  const { agents } = useAgents()
  const [playing, setPlaying] = useState(false)
  const commentsEndRef = useRef(null)
  const navigate = useNavigate()

  const { fetchData } = useAutoGPTAPI()

  useEffect(() => {
    scrollToBottom()
  }, [aiHistoryArray])

  useEffect(() => {
    const interval = setInterval(async () => {
      if (playing) {
        fetchData()
      }
    }, 500)
    return () => clearInterval(interval)
  }, [playing])

  if (!id) {
    navigate("/")
    return null
  }
  const currentAi = aiHistory[id]

  // This function will scroll to the bottom of the messages element
  const scrollToBottom = () => {
    if (!commentsEndRef.current) return
    // @ts-ignore
    commentsEndRef.current.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <Container>
      <Grid>
        <RightTasks>
          <Flex direction="column" gap={1}>
            <h2>All your AI</h2>
            <SearchInput />
            {aiHistoryArray.map((ai) => (
              <TaskCard ai={ai} key={ai.id} />
            ))}
            <SButton
              $color="yellow300"
              variant="outlined"
              onClick={() => navigate("/")}
            >
              Create a new Ai
            </SButton>
          </Flex>
        </RightTasks>
        <Discussion>
          <Flex direction="column" gap={0.5}>
            <ActionBar>
              <Flex justify="space-between" align="center" fullWidth>
                <Flex gap={0.5} align="center">
                  <CommentRoundedIcon />
                  <h2>Ai Name</h2>
                  <Chip label="Continuous" color="primary" size="small" />
                </Flex>
                <Flex gap={0.5} align="center">
                  <SIconButton>
                    <Delete fontSize="small" />
                  </SIconButton>
                  <SIconButton>
                    <Archive fontSize="small" />
                  </SIconButton>
                </Flex>
              </Flex>
              <div>
                Ai role is lorem ipsum dolor sit amet, consectetur adipiscing
                elit. Aliquam at ipsum eu nunc commodo posuere et sit amet
                ligula. Aenean quis rhoncus nunc, quis interdum justo. Duis quis
                nisl
              </div>
            </ActionBar>
            <CommentContainer>
              <Answers answers={currentAi.answers} />
              <div ref={commentsEndRef} />
            </CommentContainer>
            <InputContainer>
              <Input placeholder="your input" />
              {!playing && (
                <SIconButton
                  onClick={() => {
                    setPlaying(!playing)
                    AutoGPTAPI.startScript()
                  }}
                >
                  <PlayArrow />
                </SIconButton>
              )}
              {playing && (
                <SIconButton
                  onClick={() => {
                    setPlaying(!playing)
                    AutoGPTAPI.killScript()
                  }}
                >
                  <Stop />
                </SIconButton>
              )}
            </InputContainer>
          </Flex>
        </Discussion>
        <RightTasks>
          <Flex>
            {(currentAi.goals ?? []).map((goal) => (
              <Chip
                key={goal}
                label={goal}
                color="primary"
                size="small"
                sx={{ mr: 0.5 }}
              />
            ))}
          </Flex>
          <Flex direction="column" gap={0.5}>
            <h2>Your agents</h2>
            {currentAi.agents.map((agentName) => {
              const agent = agents[agentName]
              return <AgentCard key={agent.name} agent={agent} />
            })}
          </Flex>
        </RightTasks>
      </Grid>
    </Container>
  )
}

export default MainPage
