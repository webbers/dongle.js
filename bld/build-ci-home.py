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

class DongleFileFilter(FileFilter):
    def __init__( self ):
        FileFilter.__init__( self, ['*\\.svn\\*', '\\uploads' ], ['*Test*', '*Compiler*', 'Ploe*', 'Moq*', 'System*', 'mscorlib*', '*esults*' ], ['.pdb','.nlp']  )

projectRootDir = os.path.abspath( os.path.join( os.path.dirname( __file__ ), '../' ) )
assemblyPath = os.path.abspath( os.path.join( os.path.dirname( __file__ ), '../package.json' ) )
pubDir = os.path.abspath( os.path.join( os.path.dirname( __file__ ), '../pub' ) )
distDir = os.path.abspath( os.path.join( os.path.dirname( __file__ ), '../dist' ) )
resDir = os.path.abspath( os.path.join( os.path.dirname( __file__ ), '../res' ) )

#--------------------------------------------------------------------
bp = Builder( "Dongle.Js" )
bp.addStep( MainBuild() )

if not bp.build():
    sys.exit(1)