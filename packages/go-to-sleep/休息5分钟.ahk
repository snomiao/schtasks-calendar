; save with utf8 with bom 
; msgbox % A_ScriptName
#SingleInstance, Force

Send ^#d
Run https://www.youtube.com/watch?v=eJZ7uzjoh90, , Maximize

return
; 自启
RunSelfCMD := """" A_AhkPath " " A_ScriptFullPath " --schtask" """"
taskName := A_ScriptName
RunWait schtasks /Create /tn %taskName% /sc daily /st 00:25 /ET 23:59 /RI 30 /tr %RunSelfCMD% /F,, Hide

