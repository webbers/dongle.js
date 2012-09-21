import subprocess

def ExecProg( FilePath, reporter, cwd = None ): 
	print "Executando: " + FilePath + " no diretório " + cwd
	startupinfo = subprocess.STARTUPINFO()
	startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW
	process = subprocess.Popen( FilePath, cwd=cwd, stdout=subprocess.PIPE, startupinfo=startupinfo )
	lines = process.stdout.readlines()
	for line in lines:
		reporter.message( line.replace( "\r\n", "" ) )
	return process.wait()