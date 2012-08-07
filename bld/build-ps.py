import os
import sys

from mainbuild import *
from steps.checkunversionedfilesstep import *
from steps.tortoisesvncommitstep import *
from steps.deltreestep import *

import re

#--------------------------------------------------------------------
bp = Builder( "WebUtils" )

rootPath = os.path.join( os.path.dirname( __file__ ), '../' )
bp.addStep( CheckUnversionedFilesStep( rootPath ) )
bp.addStep( MainBuild() )
bp.addStep( TortoiseSvnCommitStep( rootPath ) )

if not bp.build():
    sys.exit(1)