
// Help guarantee positions of dialog items by not resizing it with the
// list of all the people the content is shared with.
// This list is instead displayed on top of the page as some kind of a
// absolute element that expands on hover and actually seems to give a
// better user experience. The profile pictures are also hidden because
// I find them unnecessarily distracting. Written at 5AM. Thank. ^_^
const peopleListCSS = document.createElement("style");
peopleListCSS.innerHTML = `
.acl-target-list-container {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;    
    height: 30px;
    opacity: 0.5;
}
.acl-target-list-container:hover {
    height: auto;
    opacity: 1;
}
.acl-target-list-inner-container {
    display: flex;
    flex-flow: row wrap;
    align-items: flex-start;
}
.acl-target-list-inner-container .target-item {
    padding: 0;
    line-height: normal;
}
.acl-target-list-inner-container .target-item .profile-photo {
    display: none;
}
.acl-target-list-inner-container .target-item .acl-target-item {
    margin: 0 5px;
}
`;
document.body.appendChild(peopleListCSS);

// A special-purpose little green square that helps my AutoHotkey
// script recognize that the site is loaded and ready to be
// tampered with. Eventually I plan on fully supporting the
// automation of spreading out a list of people over all the
// imported CSV video IDS automatically using some kind of a JS lib
// probably puppeteer.
const loadedFlagELM = document.createElement("div");
loadedFlagELM.style = `
    z-index: 99;
    background: green;
    width: 10px;
    height: 10px;
    bottom: 0px;
    left: 0px;
    position: fixed;
    display: block;
    pointer-events: none;
`
try {
    document.querySelector(".yt-dialog-base").appendChild(loadedFlagELM);
} catch (e) {
    loadedFlagELM.style.background = "red";
    document.body.appendChild(loadedFlagELM);
}