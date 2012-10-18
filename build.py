import os
import sys
from pyhammer.builder import Builder
from pyhammer.filters.csbinaryfilefilter import CsBinaryFileFilter
from pyhammer.steps.io.copyfilteredfilesstep import CopyFilteredFilesStep
from pyhammer.steps.io.deltreestep import DelTreeStep
from pyhammer.steps.helpers.runcommandstep import RunCommandStep
from pyhammer.steps.svn.svncommitdirstep import SvnCommitDirStep
from pyhammer.steps.svn.svncreatetagdirstep import SvnCreateTagDirStep
from pyhammer.steps.svn.svnimportdirstep import SvnImportDirStep
from pyhammer.steps.svn.svndeletestep import SvnDeleteStep
from pyhammer.steps.text.incrementversionstep import IncrementVersionStep

#-Paths-----------------------------------------------------------------------------------------------------------------
tempDir  = os.path.join( os.path.dirname( __file__ ), '../dist' )
rootDir  = os.path.join( os.path.dirname( __file__ ), '../' )
pubDir = os.path.abspath( os.path.join( os.path.dirname( __file__ ), '../pub' ) )
versionFile = os.path.abspath( os.path.join( os.path.dirname( __file__ ), '../package.json' ) )
repoUrl = 'http://cronos:9090/gasrd/Web/pub/dongle.js/trunk'
repoTagUrl = 'http://cronos:9090/gasrd/Web/pub/dongle.js/tags'

#-Steps-----------------------------------------------------------------------------------------------------------------
Builder.addStep( "del-temp", DelTreeStep( tempDir ) )
Builder.addStep( "install-deps", RunCommandStep( 'npm.cmd install', rootDir ) )
Builder.addStep( "grunt", RunCommandStep( 'grunt.cmd full', rootDir ) )
Builder.addStep( "del-repo", SvnDeleteStep( repoUrl ) )
Builder.addStep( "del-pub", DelTreeStep( pubDir ) )
Builder.addStep( "copy", CopyFilteredFilesStep(CsBinaryFileFilter(), tempDir, pubDir ) )
Builder.addStep( "import", SvnImportDirStep( pubDir, repoUrl ) )
Builder.addStep( "increment-rev", IncrementVersionStep( versionFile, "revision", 3 ) )
Builder.addStep( "increment-min", IncrementVersionStep( versionFile, "minor", 3 ) )
Builder.addStep( "commit-version-file", SvnCommitDirStep( versionFile, 1, sys.argv[2], sys.argv[3]  ) )
Builder.addStep( "create-tag", SvnCreateTagDirStep( repoUrl, repoTagUrl , versionFile ) )

#-Root steps------------------------------------------------------------------------------------------------------------
Builder.addStep( "ps", "del-temp install-deps grunt")
Builder.addStep( "ci", "ps del-repo del-pub copy import del-temp")
Builder.addStep( "deploy-revision", "increment-rev ci create-tag commit-version-file")
Builder.addStep( "deploy-minor", "increment-min ci create-tag commit-version-file")
Builder.runBuild()
