import api from "./authService"

export const generateQuestion = async (category, difficulty) => {

  const res = await api.post("/ai/generate-question", {
    category,
    difficulty
  })

  return res.data
}

export const evaluateAnswer = async (question, answer) => {

  const res = await api.post("/ai/evaluate", {
    question,
    answer
  })

  return res.data
}