import java.awt.{BorderLayout, Color, Dimension}
import javax.swing.{ImageIcon, JButton, JFrame, JPanel, WindowConstants}
import javax.imageio.ImageIO

object Home extends App {

  val frame: JFrame = new JFrame("Board Games")
  val panel: JPanel = new JPanel()
  val chessButton: JButton = new JButton("Chess")
  val xoButton: JButton = new JButton("XO")
  val checkersButton: JButton = new JButton("Checkers")
  val connect4Button: JButton = new JButton("Connect-4")
  val sudokuButton: JButton = new JButton("Sudoku")
  val eightQueensButton: JButton = new JButton("Eight Queens")

  frame.setMinimumSize(new Dimension(600, 600))
  frame.setLocationRelativeTo(null)
  frame.setResizable(false)
  frame.setDefaultCloseOperation(WindowConstants.DISPOSE_ON_CLOSE)
  frame.setLayout(new BorderLayout(10, 10))

  panel.setBounds(0, 50, 800, 800)
  panel.setLocation(2000, 2000)
  panel.setBackground(new Color(8, 3, 23))

  def loadImageIcon(resourcePath: String, width: Int, height: Int): ImageIcon = {
    new ImageIcon(ImageIO.read(getClass().getClassLoader.getResource(resourcePath)).getScaledInstance(width, height, 5))
  }

  chessButton.setIcon(loadImageIcon("resources/chess.png", 100, 100))
  xoButton.setIcon(loadImageIcon("resources/tic-tac-toe.png", 100, 100))
  checkersButton.setIcon(loadImageIcon("resources/checkers.png", 100, 100))
  connect4Button.setIcon(loadImageIcon("resources/connect-four.png", 100, 100))
  sudokuButton.setIcon(loadImageIcon("resources/sudoku.png", 100, 100))
  eightQueensButton.setIcon(loadImageIcon("resources/eight-queens.png", 100, 100))

  val buttonList = List(chessButton, xoButton, checkersButton, connect4Button, sudokuButton, eightQueensButton)
  buttonList.foreach(_.setBackground(Color.white))

  xoButton.addActionListener(_ => {
    val ticTacToe = new TicTacToeEngine()
    panel.setVisible(false)
    new BoardGameEngine(frame, ticTacToe.getController, ticTacToe.getDrawer)
  })

  sudokuButton.addActionListener(_ => {
    val sudoku = new Sudoku()
    panel.setVisible(false)
    new BoardGameEngine(frame, sudoku.getController, sudoku.getDrawer)
  })

  frame.add(panel)
  buttonList.foreach(panel.add)

  frame.pack()
  frame.setVisible(true)

}
