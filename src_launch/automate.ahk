#SingleInstance Force
SetKeyDelay, 250 ; Delay after each Send key required for proper responsivity

; Window titles
_menu := "Menu - PrivateShare ahk_exe electron.exe"
_browse := "Browse - PrivateShare ahk_exe electron.exe"

; Flag RGB matches
_flag_ok := "0x008000" ; green
_flag_no := "0xFF0000" ; red
_flag_done := "0xFFA500" ; orange

; Assigned later on
_list := ""             ; guiInputList Output
_last_clipboard := ""   ; contents of clipboard saved before being overwritten to be restored later
_c_x := ""              ; for spreading out an array to be used in %...% syntax
_c_y := ""              ; ^
_loop := ""             ; Loop breaker

; Global keybinds that work always
ESC::ExitApp

; Global keybinds that only work if conditions are met
#If WinExist(_menu) && WinExist(_browse)
    F1::
        ; Get the list of e-mails from user
        _list := guiInputList()
        If (_list == "") {
            MsgBox % "Nothing entered, canceling"
            return
        }
        
        _loop := true
        while (_loop) {
            ; Activate and open next link in menu if any are left
            WinActivate, %_menu%
            WinWaitActive, %_menu%
            Send, {Tab} ; focus next VIDEO_ID link
            _flag := getFlag()
            If (_flag != _flag_ok) {
                Msgbox % "Done"
                break
            }
            Send {Enter}
            
            ; Wait for the browse window to load
            WinActivate, %_browse%
            WinWaitActive, %_browse%
            _flag := getFlag()
            while (_flag != _flag_ok) {
                _flag := getFlag()
                Sleep 75
            }
            
            ; Fill out the form
            _center := getTextarea()
            _c_x := _center[1]
            _c_y := _center[2]
            SetControlDelay -1
            ControlClick, X%_c_x%  Y%_c_y%, %_browse%,,,,Pos
            _last_clipboard := Clipboard
            Clipboard := _list ; A trick for faster writing is to use the Clipboard
            Send ^{a} ; Precaution to overwrite if inputing to the same box
            Send ^{v} ; Pastes the Clipboard contents into the textarea
            Clipboard := _last_clipboard
            Send {Tab}{Space} ; Turn off notify via email
            Send {Tab} ; Focus on the "Save button"
            Send {Space} ; Hit the save button
            Sleep 2000 ; Assume that the saving will be done in 2 seconds
        }
        Return
        
    F2::
        ; Disable next iteration of the loop
        _loop := false
        return
#If


; Function definitions

getFlag() {
    WinGetPos,,,,_menu_height ; get position for flag
    _menu_height -= 10 ; adjust to match position of flag
    ;Tooltip, Here, 10, %_menu_height% ; Tooltip for debugging the position calculation
    PixelGetColor, _flag, 10, %_menu_height%, RGB ; get color of flag relative to window
    return _flag
}

getTextarea() {
    WinGetPos,,,_width,_height ; get center of the window
    _width /= 2
    _height /= 2
    ;Tooltip, Here, %_width%, %_height% ; Tooltip for debugging the position calculation
    return [_width, _height]
}

guiInputList() {
    Static _list
    
    Gui, +LastFound
    GuiHWND := WinExist()
    Gui,Add,Text,,  Enter the list of e-mails to be appended to each video
    Gui,Add,Edit,   v_list r10 w600
    Gui,Add,Button, xs+200  gGUI_OK,      OK
    Gui,Add,Button, x+10    gGUI_Cancel,  Cancel
    Gui,Show
    
    ; cant use Return here, wait for gui destroy
    WinWaitClose, ahk_id %GuiHWND%
    
    ; Happens after "Gui, Destroy"
    return _list

    GUI_Cancel:
    GuiClose:
        _list := ""
        Gui, Destroy
        return

    GUI_OK:
        Gui, Submit ; saves v_list control content to _list variable
        Gui, Destroy
        return
}




