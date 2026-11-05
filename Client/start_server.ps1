$process = Start-Process npm -ArgumentList "run dev" -PassThru -NoNewWindow -RedirectStandardOutput "dev_server.log" -RedirectStandardError "dev_server_err.log"
Write-Output "Started process $($process.Id)"
