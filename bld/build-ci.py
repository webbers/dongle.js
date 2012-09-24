import os
import sys
import re

import setlibspath

from mainbuild import *
from steps.incrementbuildversionstep import *
from steps.svncommitdirstep import *
from steps.svnimportdirstep import *
from steps.runcommandstep import *
from filters.pythonfilefilter import *
from filters.csbinaryfilefiltertests import *
from steps.svndeletestep import *
from steps.movefilesstep import *

class WebUtilsFileFilter(FileFilter):
    def __init__( self ):
        FileFilter.__init__( self, ['*\\.svn\\*', '\\uploads' ], ['*Test*', '*Compiler*', 'Ploe*', 'Moq*', 'System*', 'mscorlib*', '*esults*' ], ['.pdb','.nlp']  )

projectRootDir = os.path.abspath( os.path.join( os.path.dirname( __file__ ), '../' ) )
assemblyPath = os.path.abspath( os.path.join( os.path.dirname( __file__ ), '../package.json' ) )
pubDir = os.path.abspath( os.path.join( os.path.dirname( __file__ ), '../pub' ) )
distDir = os.path.abspath( os.path.join( os.path.dirname( __file__ ), '../dist' ) )
resDir = os.path.abspath( os.path.join( os.path.dirname( __file__ ), '../res' ) )
repoUrl = 'http://cronos:9090/gasrd/Web/pub/dongle.js/trunk'

#--------------------------------------------------------------------
bp = Builder( "Dongle.Js" )
bp.addStep( IncrementBuildVersionStep( assemblyPath, projectRootDir ) )
bp.addStep( MainBuild() )

bp.addStep( SvnDeleteStep(repoUrl))
bp.addStep( DelTreeStep( pubDir ) )

bp.addStep( CopyFilteredFilesStep( WebUtilsFileFilter(), distDir, pubDir ) )
bp.addStep( DelTreeStep( distDir ) ) 
bp.addStep( SvnImportDirStep( pubDir, repoUrl ) )

if not bp.build():
    sys.exit(1)