; save with utf8 with bom 
; msgbox % A_ScriptName
#SingleInstance, Force

Send ^#d
Run E:\S\76G的电子书#B2YZTLQJYCRWAM4LJLWBZWH7EEYU25J3T\整理3200\[以色列]尤瓦尔·赫拉利-未来简史·人类简史（套装）.epub,, Maximize

; Return

return
; 自启
RunSelfCMD := """" A_AhkPath " " A_ScriptFullPath """"
taskName := A_ScriptName

; 删
; RunWait schtasks /Delete /tn %taskName% /F,, Hide

; 增
RunWait schtasks /Create /tn %taskName% /sc daily /st 06:00 /tr %RunSelfCMD% /F,, Hide

; 测
; msgbox, schtasks /Change /tn %taskName% /sc daily /st 16:30 /tr %RunSelfCMD%
; RunWait schtasks /Run /tn %taskName%

