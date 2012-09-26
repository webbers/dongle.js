import os
import sys

from mainbuild import *
from steps.checkunversionedfilesstep import *
from steps.tortoisesvncommitstep import *
from steps.deltreestep import *

import re

#--------------------------------------------------------------------
bp = Builder( "Dongle.Js" )

rootPath = os.path.join( os.path.dirname( __file__ ), '../' )
bp.addStep( MainBuild() )

if not bp.build():
    sys.exit(1)