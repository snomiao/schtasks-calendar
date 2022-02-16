; save with utf8 with bom 
#SingleInstance, Force
; 
; new desktop
SendInput ^#d

Run https://calendar.google.com/calendar/r

return
; 自启
; autoRunTime := "03:30"
; RunSelfCMD := """" A_AhkPath " " A_ScriptFullPath """"
; taskName := A_ScriptName

; ; 删
; ; RunWait schtasks /Delete /tn %taskName% /F,, Hide

; ; 增
; RunWait schtasks /Create /tn %taskName% /sc daily /st %autoRunTime% /tr %RunSelfCMD% /F,, Hide

; ; 测
; ; msgbox, schtasks /Change /tn %taskName% /sc daily /st 16:30 /tr %RunSelfCMD%
; ; RunWait schtasks /Run /tn %taskName%