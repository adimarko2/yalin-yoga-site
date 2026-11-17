/* מקור אחד לכל הלו"ז: האתר וגרפיקת הלו"ז קוראים מכאן.
   day: 0 = ראשון ... 6 = שבת. לפי התמונה ששלחה ילין ב-17.11.2026 (עדיין בבדיקה). */
window.YALIN = {
  name: "ילין",
  phone: "050-8145029",
  whatsapp: "972508145029",
  instagram: "yalin_sh77",
  paybox: "https://links.payboxapp.com/0SMSisBzX7b",
  area: "שדרות יצחק רגר, באר שבע",
  duration: "שעה ו-20 דקות",
  maxPeople: 10,
  cancelHours: 12,
  style: "חצי סדרה ראשונה של אשטנגה",
  days: ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"],
  short: ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"],
  classes: [
    { day: 0, time: "08:00", level: "מתחילים" },
    { day: 0, time: "19:00", level: "מתקדמים" },
    { day: 1, time: "08:00", level: "מתקדמים" },
    { day: 1, time: "18:00", level: "מתחילים" },
    { day: 2, time: "09:00", level: "מתקדמים" },
    { day: 2, time: "19:00", level: "מתחילים" },
    { day: 3, time: "18:00", level: "מתחילים" },
    { day: 4, time: "09:00", level: "מתחילים" },
    { day: 4, time: "15:00", level: "מתקדמים" }
  ],
  onDemandDays: [5, 6],
  prices: [
    { title: "4 השיעורים הראשונים", price: 25, unit: "לשיעור", note: "להכיר בלי להתחייב" },
    { title: "שיעור בודד", price: 50, unit: "לשיעור", note: "מהשיעור החמישי, או כניסה חד-פעמית" },
    { title: "מנוי 5 שיעורים", price: 225, unit: "לחודש", note: "45 ₪ לשיעור" },
    { title: "מנוי 10 שיעורים", price: 400, unit: "לחודש", note: "40 ₪ לשיעור", best: true }
  ]
};
