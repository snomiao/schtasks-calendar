; save with utf8 with bom 
; msgbox % A_ScriptName
#SingleInstance, Force

Send ^#d
Run E:\(20200602)Daily English Dictation\ytb-dl,, Maximize
Run onenote:https://snomiao-my.sharepoint.com/personal/snomiao_snomiao_com/Documents/Notebooks/喵喵/归档课程/喵数学专业英语.one#📌📝每日英语听写%20Daily%20English%20Dictation%20DED&section-id={40D11DD0-3E74-4C8E-ACA7-3157B6479489}&page-id={0F93F63E-0779-4F5D-96FD-AF4EC3679C23}&object-id={477E777A-67C9-0A2A-0D1F-7F07E04E9D4D}&25,, Maximize

if( A_Args[1] == "--schtask"){
    
}else{
    return
    ; 自启
    RunSelfCMD := """" A_AhkPath " " A_ScriptFullPath " --schtask " """"
    taskName := A_ScriptName
    
    ; 增
    RunWait schtasks /Delete /tn %taskName%0025 /F,, Hide
    RunWait schtasks /Create /tn %taskName%0025 /sc daily /st 00:25 /tr %RunSelfCMD% /F,, Hide
    
    ; 测
    ; msgbox, schtasks /Change /tn %taskName% /sc daily /st 16:30 /tr %RunSelfCMD%
    ;    msgbox Wanna test?
    ;   RunWait schtasks /Run /tn %taskName%
}
