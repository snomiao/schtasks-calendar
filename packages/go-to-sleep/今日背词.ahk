; save with utf8 with bom 
; msgbox % A_ScriptName
#SingleInstance, Force
SetTitleMatchMode, RegEx
if(WinExist(".* - Anki")){
    WinHide
    Send ^#d
    WinShow
    WinActivate
}else{
    Send ^#d
    Run C:\Users\Public\Desktop\Anki.lnk,, Maximize
}

; Return

return
; 自启
RunSelfCMD := """" A_AhkPath " " A_ScriptFullPath """"
taskName := A_ScriptName

; 删
; RunWait schtasks /Delete /tn %taskName% /F,, Hide

; 增
RunWait schtasks /Create /tn %taskName% /sc daily /st 18:30 /tr %RunSelfCMD% /F,, Hide

; 测
; RunWait schtasks /Run /tn %taskName%

