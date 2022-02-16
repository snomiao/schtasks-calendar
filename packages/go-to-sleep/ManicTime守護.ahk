; 1min restart
#Persistent
#SingleInstance, force
SetTimer, start, 60000
Return

start:
    Process, Exist, ManicTime.exe
    PID := ErrorLevel
    If(!PID){
        path = D:\Users\snomi\ManicTime\ManicTime_4.4.9.0_Green\ManicTime
        exe = ManicTime.exe
        ; cmd /c start D:\Users\snomi\ManicTime\ManicTime_4.4.9.0_Green\ManicTime\ManicTime.exe
        cmd := "cmd /c start " path "\" exe
        Run, %cmd%, %path%  ; , Hide
        MsgBox, ManicTime launched.
        ; ExitApp
    }
Return