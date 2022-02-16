#SingleInstance, force

dir := FileExist(dir) ? dir : A_ScriptDir "\ManicTime"
dir := FileExist(dir) ? dir : "C:\ProgramData\ManicTime\ManicTime_4.4.9.0_Green\ManicTime"
dir := FileExist(dir) ? dir : USERPROFILE "\ManicTime_4.4.9.0_Green\ManicTime"
dir := FileExist(dir) ? dir : "C:\Program Files\ManicTime"
dir := FileExist(dir) ? dir : "C:\Program Files (x86)\ManicTime"

global exeFile := "ManicTime.exe"
global path := dir "\" exeFile

Menu, Tray, Icon, %path%, 1

return

~^s:: onSave()
!m:: manicExport()

onSave()
{
    sleep 128
    Reload
}
windowClean()
{
    WinClose Export ahk_exe ManicTimeClient.exe
    WinClose Save As ahk_exe ManicTimeClient.exe
    WinClose Import and export ahk_exe ManicTimeClient.exe
}
manicExport()
{
    manicLaunch()

    windowClean()
    
    WinActivate ManicTime ahk_exe ManicTimeClient.exe
    
    WinWaitActive ManicTime ahk_exe ManicTimeClient.exe
    SendEvent {F10}{right}{enter}{down 2}{enter}
    
    WinWaitActive Import and export ahk_exe ManicTimeClient.exe
    SendEvent {Tab 4}{Down 2}{Tab}{Enter}
    
    WinWaitActive Save As ahk_exe ManicTimeClient.exe
    SetWorkingDir, %A_ScriptDir%/../../
    
    dataPath := A_WorkingDir "\data\" A_ComputerName "_ManicTimeData" ".csv"
    FileDelete, %dataPath%
    SendEvent {Text}%dataPath%
    SendEvent {Tab}c
    SendEvent {Tab}{Enter}
    
    WinWaitActive Export ahk_exe ManicTimeClient.exe
    SendEvent {Enter}
    
    WinWaitActive Import and export ahk_exe ManicTimeClient.exe
    SendEvent {Esc}
}

manicLaunch(){
	global exeFile
	global path
    Process, Exist, %exeFile%
    PID := ErrorLevel
    if (!PID) {
        cmd := "cmd /c start " path
        Run, %cmd%, %dir%
        TrayTip, , ManicTime launched
    }
}
