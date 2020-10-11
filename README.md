# PrivateShare

> Electron front-end to quickly set shared e-mails for multiple YouTube videos.

---

1. <u>Install dependencies:</u> `npm install`

2. <u>Run the app afterwards:</u> `npm run start` or launch *run.bat* from *src_launch* folder

3. <u>Automating the process:</u> use *automate.ahk*, however this script may need to be modified or cause unstable behavior on many systems, it could also be considered botting and as such violate the YouTube terms of service. Use with caution! I am not responsible for anything that happens to your YouTube/Google account or any other property if you use this script. I do not endorse its usage.

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

![GUI](/readme_images/gui2.png)

There is also a hidden menubar with quick devtools and reload buttons. Expandable by clicking the *Alt* button.