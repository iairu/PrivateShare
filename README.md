# PrivateShare

> Electron front-end to quickly set shared e-mails for multiple YouTube videos.

---

1. <u>Install dependencies:</u> `npm install`

2. <u>Run the app afterwards:</u> `npm run start` or launch *run.bat* from *src_launch* folder

---

On the first load you have to login. Google will likely complain about cookies being off, the solution is to click on the link in menu again or restart the app.

---

Turns a **UTF-8** encoded CSV file with the following format:

```
VIDEO_ID;Some title
VIDEO_ID;Some title
VIDEO_ID;Some title
VIDEO_ID;Some title
```

Into a quick access menu for privacy settings:

![GUI](/readme_images/gui.png)