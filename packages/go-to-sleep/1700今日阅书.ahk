; save with utf8 with bom 
; msgbox % A_ScriptName
#SingleInstance, Force

Send ^#d
Run E:\S\76G的电子书#B2YZTLQJYCRWAM4LJLWBZWH7EEYU25J3T\suguniang02\2015-11-21`,22\大棋局：美国的首要地位及其地缘战略.mobi,, Maximize

; Return

return
; 自启
RunSelfCMD := """" A_AhkPath " " A_ScriptFullPath """"
taskName := A_ScriptName

RunWait schtasks /Delete /tn %taskName% /F,, Hide
RunWait schtasks /Create /tn %taskName% /sc daily /st 17:00 /tr %RunSelfCMD% /F,, Hide

; 测
; msgbox, schtasks /Change /tn %taskName% /sc daily /st 16:30 /tr %RunSelfCMD%
; RunWait schtasks /Run /tn %taskName%

