; save with utf8 with bom 
; msgbox % A_ScriptName
#SingleInstance, Force

Send ^#d
Run C:\Program Files (x86)\Google\Chrome\Application\chrome.exe https://calendar.google.com/calendar/r
Run D:\Users\snomi\ManicTime\ManicTime_4.4.9.0_Green\ManicTime\ManicTimeClient.exe

; Return

return
; 自启
RunSelfCMD := """" A_AhkPath " " A_ScriptFullPath """"
taskName := A_ScriptName

; 删
; RunWait schtasks /Delete /tn %taskName% /F,, Hide

; 增
RunWait schtasks /Create /tn %taskName% /sc daily /st 16:30 /tr %RunSelfCMD% /F,, Hide

; 测
; msgbox, schtasks /Change /tn %taskName% /sc daily /st 16:30 /tr %RunSelfCMD%
; RunWait schtasks /Run /tn %taskName%

