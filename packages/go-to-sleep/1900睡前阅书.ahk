; save with utf8 with bom 
; msgbox % A_ScriptName
#SingleInstance, Force

Send ^#d
Run E:\S\76G的电子书#B2YZTLQJYCRWAM4LJLWBZWH7EEYU25J3T\小书屋和sobooks\azw3\哥德尔·艾舍尔·巴赫：集异璧之大成.azw3,, Maximize

; Return

return
; 自启
RunSelfCMD := """" A_AhkPath " " A_ScriptFullPath """"
taskName := A_ScriptName

; 删
; RunWait schtasks /Delete /tn %taskName% /F,, Hide

; 增
RunWait schtasks /Create /tn %taskName% /sc daily /st 19:00 /tr %RunSelfCMD% /F,, Hide

; 测
; RunWait schtasks /Run /tn %taskName%

