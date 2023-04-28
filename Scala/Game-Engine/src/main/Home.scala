import Engines.{BoardGameEngine,SudokuEngine, TicTacToeEngine}

import java.awt.{BorderLayout, Color, Dimension}
import javax.swing.{ImageIcon, JButton, JFrame, JPanel, WindowConstants}
import javax.imageio.ImageIO

object Home extends App {

  val frame: JFrame = new JFrame("Board Games")
  val panel: JPanel = new JPanel()

  val xo: JButton = new JButton("XO")
  val chess: JButton = new JButton("Chess")
  val sudoku: JButton = new JButton("Sudoku")
  val checkers: JButton = new JButton("Checkers")
  val connect4: JButton = new JButton("Connect-4")
  val eightQueens: JButton = new JButton("Eight Queens")
//  val reverse: JButton = new JButton("Reverse")

  frame.setMinimumSize(new Dimension(600, 600))
  frame.setLocationRelativeTo(null)
  frame.setResizable(true)
  frame.setDefaultCloseOperation(WindowConstants.DISPOSE_ON_CLOSE)
  frame.setLayout(new BorderLayout(10, 10))

  panel.setBounds(0, 50, 800, 800)
  panel.setLocation(2000, 2000)
  panel.setBackground(Color.white)

  def loadImageIcon(resourcePath: String, width: Int, height: Int): ImageIcon = {
    new ImageIcon(ImageIO.read(getClass().getClassLoader.getResource(resourcePath)).getScaledInstance(width, height, 5))
  }

  chess.setIcon(loadImageIcon("resources/chess.png", 100, 100))
  xo.setIcon(loadImageIcon("resources/tic-tac-toe.png", 100, 100))
  checkers.setIcon(loadImageIcon("resources/checkers.png", 100, 100))
  connect4.setIcon(loadImageIcon("resources/connect-four.png", 100, 100))
  sudoku.setIcon(loadImageIcon("resources/sudoku.png", 100, 100))
  eightQueens.setIcon(loadImageIcon("resources/eight-queens.png", 100, 100))
//  reverse.setIcon(loadImageIcon("resources/reverse.png", 10, 5))


  val buttonList = List(chess, xo, checkers, connect4, sudoku, eightQueens)
  buttonList.foreach(_.setBackground(Color.white))

  xo.addActionListener(_ => {
    val ticTacToe = new TicTacToeEngine()
    panel.setVisible(false)
    new BoardGameEngine(frame, ticTacToe.getController, ticTacToe.getDrawer)
  })

  sudoku.addActionListener(_ => {
    val sudoku = new SudokuEngine()
    panel.setVisible(false)
    new BoardGameEngine(frame, sudoku.getController, sudoku.getDrawer)
  })
//  reverse.addActionListener(_ => {
//      panel.setVisible(true)
//  })

  frame.add(panel)
//  frame.add(reverse, BorderLayout.NORTH)
  buttonList.foreach(panel.add)

  frame.pack()
  frame.setVisible(true)

}
