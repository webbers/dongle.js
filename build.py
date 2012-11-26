import os
import sys
import argparse

from pyhammer.builder import Builder
from pyhammer.tasks.git.gitcheckouttask import GitCheckoutTask
from pyhammer.tasks.git.gitcommitandpushtask import GitCommitAndPushTask
from pyhammer.tasks.helpers.commandtask import CommandTask
from pyhammer.tasks.io.copytask import CopyTask
from pyhammer.tasks.io.deletetask import DeleteTask
from pyhammer.tasks.svn.svncreatetagtask import SvnCreateTagTask
from pyhammer.tasks.svn.svndeletetask import SvnDeleteTask
from pyhammer.tasks.svn.svnimporttask import SvnImportTask
from pyhammer.tasks.text.incrementversiontask import IncrementVersionTask

#-Argument-Parser-------------------------------------------------------------------------------------------------------
parser = argparse.ArgumentParser()
parser.add_argument( '--build', type=str, required=True )
args = parser.parse_args()

#-Paths-----------------------------------------------------------------------------------------------------------------
rootDir  = os.path.abspath( os.path.dirname( __file__ ) )
tempDir  = os.path.join( rootDir, 'dist' )
pubDir = os.path.join( rootDir, 'pub' )
versionFile = os.path.join( rootDir, 'package.json' )
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
Builder.addTask( "increment-rev", IncrementVersionTask( versionFile, "revision") )
Builder.addTask( "commit-version-file", GitCommitAndPushTask( rootDir, 1 ) )
Builder.addTask( "create-tag", SvnCreateTagTask( repoUrl, repoTagUrl , versionFile ) )
Builder.addTask( "git-checkout", GitCheckoutTask( "master", rootDir ) )

#-Root steps------------------------------------------------------------------------------------------------------------
Builder.addTask( 'pre-commit', [ 'del-temp', 'install-deps' ,'grunt' ])
Builder.addTask( 'ci', [ 'pre-commit', 'del-repo', 'del-pub', 'copy', 'import', 'del-temp' ])
Builder.addTask( 'pub-trunk', [ 'git-checkout', 'increment-rev', 'ci', 'commit-version-file', 'create-tag' ])

Builder.runBuild(args.build)