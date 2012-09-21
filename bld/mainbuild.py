import os
import sys
import re
import setlibspath

from builder import *
from steps.deltreestep import *
from steps.delstep import *
from steps.svnupdatedirstep import *
from test import *
from steps.csprojectbuildstep import *
from steps.runcommandstep import *
from steps.batchfilereplacestep import *
from steps.copyfilteredfilesstep import *
from steps.copydirstep import *
from steps.copyfilestep import *
from steps.movefilesstep import *
from filters.csbinaryfilefilter import *
from filters.docsfilefilter import *

sys.path.insert( 0, os.path.abspath(os.path.join( os.path.dirname( __file__ ), '../src/WebUtils' ) ) )

#--------------------------------------------------------------------
class MainBuild( Builder ):
    def __init__( self ):
        Builder.__init__( self, "dongle.js Main Build" )

    def build( self ):
        tempDir  = os.path.join( os.path.dirname( __file__ ), '../dist' )
        rootDir  = os.path.join( os.path.dirname( __file__ ), '..\\node_modules\\.bin\\' )
        
        print rootDir

        self.addStep( DelTreeStep( tempDir ) )        
        self.addStep( RunCommandStep( "grunt.cmd deploy", rootDir ) )        
                
        return Builder.build(self)