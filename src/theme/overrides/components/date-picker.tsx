import { Theme } from "@mui/material/styles";
import { buttonClasses } from "@mui/material/Button";
import Iconify from "@/global/components/Icon/iconify";

const dateList = [
  "DatePicker",
  "DateTimePicker",
  "StaticDatePicker",
  "DesktopDatePicker",
  "DesktopDateTimePicker",
  "MobileDatePicker",
  "MobileDateTimePicker",
];

const timeList = [
  "TimePicker",
  "MobileTimePicker",
  "StaticTimePicker",
  "DesktopTimePicker",
];

const switchIcon = () => <Iconify icon="eva:chevron-down-fill" width={24} />;
const leftIcon = () => <Iconify icon="eva:arrow-ios-back-fill" width={24} />;
const rightIcon = () => <Iconify icon="eva:arrow-ios-forward-fill" width={24} />;
const calendarIcon = () => <Iconify icon="solar:calendar-mark-bold-duotone" width={24} />;
const clockIcon = () => <Iconify icon="solar:clock-circle-outline" width={24} />;

const desktopTypes = dateList.reduce(
  (result: Record<string, object>, currentValue) => {
    result[`Mui${currentValue}`] = {
      defaultProps: {
        slots: {
          openPickerIcon: calendarIcon,
          leftArrowIcon: leftIcon,
          rightArrowIcon: rightIcon,
          switchViewIcon: switchIcon,
        },
      },
    };
    return result;
  },
  {}
);

const timeTypes = timeList.reduce(
  (result: Record<string, object>, currentValue) => {
    result[`Mui${currentValue}`] = {
      defaultProps: {
        slots: {
          openPickerIcon: clockIcon,
          rightArrowIcon: rightIcon,
          switchViewIcon: switchIcon,
        },
      },
    };
    return result;
  },
  {}
);

export function datePicker(theme: Theme) {
  return {
    MuiPickersLayout: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          "& .MuiPickersLayout-contentWrapper": {
            borderRadius: 20,
          },
          "& .MuiPickersLayout-actionBar": {
            padding: theme.spacing(1.5, 2),
            [`& .${buttonClasses.root}:last-of-type`]: {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              borderRadius: 100,
              fontWeight: 800,
            },
          },
        },
      },
    },
    MuiPickersDay: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600,
          "&.Mui-selected": {
            fontWeight: 800,
            backgroundColor: theme.palette.primary.main,
            "&:hover": { backgroundColor: theme.palette.primary.dark },
          },
          "&:hover": {
            backgroundColor: theme.palette.background.surfaceContainerHigh,
          },
        },
        today: {
          border: `2px solid ${theme.palette.primary.main} !important`,
        },
      },
    },
    MuiDateCalendar: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },
    ...desktopTypes,
    ...timeTypes,
  };
}
