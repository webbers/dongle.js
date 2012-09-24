from steps.abstractstep import *
from util import *
import os
import os.path

class RunCommandStep(AbstractStep):
    """Cs UnitTest Step"""

    def __init__( self, command, path = None):
        AbstractStep.__init__( self, "Run Command" )
        self.path = path
        self.command = command

    def do( self ):
        self.reporter.message( "RUN COMMAND: %s" % self.command )
        result = ExecProg( self.command, self.reporter, self.path) == 0
        return result


