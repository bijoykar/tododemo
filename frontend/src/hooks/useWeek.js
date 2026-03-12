import { useState } from 'react'
import { startOfWeek, endOfWeek, addWeeks, subWeeks, eachDayOfInterval } from 'date-fns'

export default function useWeek() {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  )

  const weekDays = eachDayOfInterval({
    start: currentWeekStart,
    end: endOfWeek(currentWeekStart, { weekStartsOn: 1 }),
  })

  const goToPrevWeek = () => setCurrentWeekStart(d => subWeeks(d, 1))
  const goToNextWeek = () => setCurrentWeekStart(d => addWeeks(d, 1))
  const goToToday = () => setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))

  return { weekDays, currentWeekStart, goToPrevWeek, goToNextWeek, goToToday }
}
