import os
import sys
from pyhammer.builder import Builder
from pyhammer.tasks.helpers.commandtask import CommandTask
from pyhammer.tasks.io.copytask import CopyTask
from pyhammer.tasks.io.deletetask import DeleteTask
from pyhammer.tasks.svn.svncommittask import SvnCommitTask
from pyhammer.tasks.svn.svncreatetagtask import SvnCreateTagTask
from pyhammer.tasks.svn.svndeletetask import SvnDeleteTask
from pyhammer.tasks.svn.svnimporttask import SvnImportTask
from pyhammer.tasks.text.incrementversiontask import IncrementVersionTask

svnUserName = ''
if len(sys.argv)>2: svnUserName = sys.argv[2]
svnPassword = ''
if len(sys.argv)>3: svnPassword = sys.argv[3]

#-Paths-----------------------------------------------------------------------------------------------------------------
tempDir  = os.path.join( os.path.dirname( __file__ ), 'dist' )
rootDir  = os.path.join( os.path.dirname( __file__ ), '.' )
pubDir = os.path.abspath( os.path.join( os.path.dirname( __file__ ), 'pub' ) )
versionFile = os.path.abspath( os.path.join( os.path.dirname( __file__ ), 'package.json' ) )
repoUrl = 'http://cronos:9090/gasrd/Web/pub/dongle.js/trunk'
repoTagUrl = 'http://cronos:9090/gasrd/Web/pub/dongle.js/tags'

#-Steps-----------------------------------------------------------------------------------------------------------------
Builder.addTask( "del-temp", DeleteTask( tempDir ) )
Builder.addTask( "install-deps", CommandTask( 'npm.cmd install', rootDir ) )
Builder.addTask( "grunt", CommandTask( 'grunt.cmd full', rootDir ) )
Builder.addTask( "del-repo", SvnDeleteTask( repoUrl ) )
Builder.addTask( "del-pub", DeleteTask( pubDir ) )
Builder.addTask( "copy", CopyTask(tempDir, pubDir ) )
Builder.addTask( "import", SvnImportTask( pubDir, repoUrl ) )
Builder.addTask( "increment-rev", IncrementVersionTask( versionFile, "revision", 3 ) )
Builder.addTask( "increment-min", IncrementVersionTask( versionFile, "minor", 3 ) )
Builder.addTask( "commit-version-file", SvnCommitTask( versionFile, 1, svnUserName, svnPassword  ) )
Builder.addTask( "create-tag", SvnCreateTagTask( repoUrl, repoTagUrl , versionFile ) )

#-Root steps------------------------------------------------------------------------------------------------------------
Builder.addTask( "ps", "del-temp install-deps grunt")
Builder.addTask( "ci", "ps del-repo del-pub copy import del-temp")
Builder.addTask( "deploy-revision", "increment-rev ci create-tag commit-version-file")
Builder.addTask( "deploy-minor", "increment-min ci create-tag commit-version-file")
Builder.runBuild()
