import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  format,
} from 'date-fns';
import { ru } from 'date-fns/locale';
import { getCareTypeColor } from '../../components/CareTypeIcon';

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

interface CalendarGridProps {
  currentDate: Date;
  events: any[];
  onDayClick: (date: Date) => void;
}

export default function CalendarGrid({ currentDate, events, onDayClick }: CalendarGridProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getEventsForDay = (date: Date) =>
    events.filter((event: any) => isSameDay(new Date(event.nextDueDate), date));

  return (
    <Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 0.5,
          mb: 0.5,
        }}
      >
        {WEEKDAYS.map((day) => (
          <Box key={day} sx={{ textAlign: 'center', py: 1 }}>
            <Typography variant="caption" fontWeight={600} color="text.secondary">
              {day}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 0.5,
        }}
      >
        {days.map((day) => {
          const dayEvents = getEventsForDay(day);
          const inMonth = isSameMonth(day, currentDate);
          const today = isToday(day);

          return (
            <Paper
              key={day.toISOString()}
              variant="outlined"
              onClick={() => onDayClick(day)}
              sx={{
                p: 1,
                minHeight: 80,
                cursor: 'pointer',
                opacity: inMonth ? 1 : 0.4,
                bgcolor: today ? 'primary.main' : 'background.paper',
                color: today ? 'primary.contrastText' : 'text.primary',
                '&:hover': {
                  bgcolor: today ? 'primary.dark' : 'action.hover',
                },
              }}
            >
              <Typography variant="body2" fontWeight={today ? 700 : 400}>
                {format(day, 'd')}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                {dayEvents.slice(0, 4).map((event: any, idx: number) => (
                  <Box
                    key={idx}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: getCareTypeColor(event.careType),
                    }}
                  />
                ))}
                {dayEvents.length > 4 && (
                  <Typography variant="caption" sx={{ fontSize: 10, lineHeight: 1 }}>
                    +{dayEvents.length - 4}
                  </Typography>
                )}
              </Box>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
}
